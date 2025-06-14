//@ts-ignore
import p5 from 'p5';
import React, {createRef} from 'react';
import { Story } from 'inkjs';

import Candidate from './candidate';
import SentenceTransformer from '../functions/sentenceTransformer.tsx';
import { normalBlend, normalBNWBlend, overlayBlend, hardlightBlend, cmykBlend, pinLightBlend } from '../functions/blending.tsx';
import { brightness, randomCMYK, randomHue, saturation, copyOver } from '../functions/imageProcessing.tsx';

import '../styles/image.css';

import { IMAGE_DIM, HIGH_BOUND, LOW_BOUND, LEANINIG_INTERVAL, UNLOCK_SCORE, MID_BOUND } from '../constants.tsx';
import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';


type ImageGeneratorProps = {
	prompts: Array<string>;
    dialogueRunner: Story;
    setDialogueVar: Function;
	initiateScene: Function;
	generateState: number;
	fillPromptBox: Function;

    memorabilia: (string | number)[][]; // [id1, id2, interpt1, interpt2, imageURL] x 3
	setMemorabilia: Function;
}

type ImageGeneratorState = {
    mainP5: any;
	images: Array<Array<any>>;
	currentP5Index: number;
}

class ImageGenerator extends React.Component<ImageGeneratorProps, ImageGeneratorState> {
    state: ImageGeneratorState = {
        mainP5: undefined,
		images: [],
		currentP5Index: -1
    };

    private p5Ref = createRef<HTMLDivElement>();
	private p5Canvas : any;
    private candidateEndRef = createRef<HTMLDivElement>();

	private st = new SentenceTransformer();

	private rawImg : { [id: string] : any; } = {};
	private imgData: { [id: string] : any; } = {}; // name : all other data in IMAGE_DATA
	private imgEmbed: { [id: string] : any; } = {}; // Embeddings for each image
	private imgWordStat: {[id: string] : any[]} = {} // For each image, store the state of unlocked keywords (marked by boolean)
	private imgButtonClicked: {[id: string] : Boolean} = {} // For each image, store whether their corresponding button has been clicked

  Sketch = (p5:any) => {

		p5.preload = async () => {
			for (var imgd of IMAGE_DATA) {
				let name = imgd["name"];

				// Loading raw assets and populate image data by name
				// this.rawImg[name] = p5.loadImage("./assets/images/" + name + ".png");
				// this.rawImg[name + "_mask_1"] = p5.loadImage("./assets/images/" + name + "_mask_1" + ".png");
				this.imgData[name] = imgd;
				this.imgEmbed[name] = await this.st.embed(imgd["descp"]);
				this.imgWordStat[name] = new Array(this.imgData[name]["keywords"].length).fill(false);
				this.imgButtonClicked[name] = false;

			}
			this.rawImg["noise"] = p5.loadImage("./assets/images/noise.png");
		}

		p5.setup = () => {
			this.p5Canvas = p5.createCanvas(IMAGE_DIM, IMAGE_DIM);
			this.p5Canvas.elt.getContext("2d", { willReadFrequently: true });
			p5.noStroke();
		}
   
		p5.draw = async () => {
			// Save image if the prompt list is updated
			if (this.props.prompts.length > 0 &&
				this.props.prompts.length-1 != this.state.currentP5Index) {

				this.state.currentP5Index = this.props.prompts.length-1; //locking

				let prompt = this.props.prompts[this.state.currentP5Index];
				let prompt_embed = await this.st.embed(prompt);

				let if_tutorial = this.props.dialogueRunner.currentTags && this.props.dialogueRunner.currentTags.indexOf('generate') == -1

				// get the similarity score for each image -KK
				let similarities = [];
				for (let imgd of IMAGE_DATA) {
					let name = imgd["name"];

					// If during tutorial phase, don't show everything
					if (!if_tutorial || name == "lily" || imgd["interpretations"].length == 0){
						// compare it to the prompt to get the similarity -KK
						let similarity = this.st.cosineSimilarity(prompt_embed, this.imgEmbed[name]);
						similarities.push({name: name, score: similarity});
					}
				}

				// sort similarities in descending order -KK
				similarities.sort((a, b) => b.score - a.score);
				console.log(similarities);

				// ----------------- //
				// KEYWORD and UNLOCK //
				// ----------------- //
				let keywords = this.imgData[similarities[0].name]["keywords"]; 
				let wordStat = this.imgWordStat[similarities[0].name];
				let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.imgData[similarities[0].name]["scene"]);
				if (visit_count == null || visit_count == undefined)
					console.log("WARNING: VISIT_COUNT IS NULL OR UNDEFINED");
				else if (visit_count > 0){
					if (similarities[0].score > HIGH_BOUND) {
						similarities[0].score = UNLOCK_SCORE;
						for (let i=0; i<wordStat.length; i++) 
							wordStat[i] = true;
					}
					else {
						for (let i=0; i<wordStat.length; i++) {
							if (wordStat[i]) continue;
							for (let j=0; j < keywords[i].length; j++){
								if (prompt.includes(keywords[i][j].toLowerCase())){
									wordStat[i] = true;
								}
							}
						}
					}
				}
				this.imgWordStat[similarities[0].name] = wordStat;
				
				// filter out all similarities that don't satisfy the lower bound
				// then select only the top one or two images for loading -KK
				let images;
				if (similarities[0].score == UNLOCK_SCORE){
					images = similarities.slice(0,1);
				} else {
					images = similarities.slice(0,2);
				}
				if (images.length > 0) {
            		await this.loadImages(images.map((img) => img.name));
				}
				p5.generateImage(similarities, wordStat);
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = async (similarities : Array<any>, wordStat : Array<boolean>) => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			let unlocked = false;
			img.loadPixels();

			// generate image based off of similarity score -KK
			let first = "noise"; let second = "noise"; let mask1 = "noise"; let mask2 = "noise";
			let filtered = similarities.filter(sim => sim.score > LOW_BOUND);

			if(similarities[0].score == UNLOCK_SCORE){
				first = similarities[0].name;
				unlocked = true;
			} else if(filtered.length > 0) { 
				first = similarities[0].name;
				mask1 = first + "_mask";
			}

			if (filtered.length > 1) {
				second = similarities[1].name;
				mask2 = second + "_mask";
			}

			let raw1 : p5.Image = this.rawImg[first];
			if (unlocked){
				p5.image(raw1, 0, 0);
			}
			else{
				let raw2 : p5.Image = this.rawImg[second];
				let raw1_mask : p5.Image = this.rawImg[mask1];
				let raw2_mask : p5.Image = this.rawImg[mask2];
				
				raw1.loadPixels();
				raw2.loadPixels();
				raw1_mask.loadPixels();
				raw2_mask.loadPixels();

				// copyOver(raw1, img);
				normalBNWBlend(img, raw1, img, 0.5);
				normalBNWBlend(img, raw2, img, 0.3 * (similarities[1]["score"] - LOW_BOUND) / ((HIGH_BOUND - LOW_BOUND)));
				// console.log([(similarities[0].score - LOW_BOUND) / (HIGH_BOUND - LOW_BOUND),
				// 		(similarities[1].score - LOW_BOUND) / (HIGH_BOUND - LOW_BOUND)])
				let raw2_ratio = similarities[1]["score"] > MID_BOUND ? 1 : 2.5;
				if (second != "noise" && this.props.dialogueRunner.variablesState[second] >= 0){
					cmykBlend(img, raw2_mask, img, 
						(similarities[1]["score"] - LOW_BOUND) / (raw2_ratio*(HIGH_BOUND - LOW_BOUND))
					);
				}
				else {
					pinLightBlend(img, raw2_mask, img, 
						(similarities[1]["score"] - LOW_BOUND) / (raw2_ratio*(HIGH_BOUND - LOW_BOUND))
					);
				}
				pinLightBlend(img, raw1_mask, img,
					(similarities[0]["score"] - LOW_BOUND) / (HIGH_BOUND - LOW_BOUND)
				);
				if (HIGH_BOUND - similarities[0]["score"] < LEANINIG_INTERVAL) {					
					pinLightBlend(img, raw1_mask, img,
						(similarities[0]["score"] - HIGH_BOUND + LEANINIG_INTERVAL) / LEANINIG_INTERVAL
					);
				}
				
				//	Use first two similarities to determine opacity of the top mask
				//let score_ratio = similarities[0]["score"] / (similarities[0]["score"] + similarities[1]["score"]);
				// let mask_opacity = Math.min(((similarities[0]["score"] - similarities[1]["score"])/LEANINIG_INTERVAL), 1.0); //Math.min(((score_ratio - 0.5) * 1/LEANINIG_INTERVAL), 1.0); // 0.5 - 0.5 + LEANING_INTERVAL -> 0.0 - 1.0
				
				// cmykBlend(img, raw2, img, mask_opacity);
				// hardlightBlend(img, raw2, img, 1 - mask_opacity);
				// cmykBlend(img, raw1_mask, img, mask_opacity);

				p5.image(img, 0, 0);
			}

			// Check if this image has been unlocked, set the variables in inky
			// -2: not unlocked, -1: unlocked but waiting for interpretation
			if(this.props.dialogueRunner.variablesState[first] == -2 && unlocked){
				this.props.setDialogueVar(first, -1);

				if (this.imgData[first]["interpretations"].length == 0)
					this.props.setDialogueVar(first, 0); // For non-core memory
			}

			this.setState((state) => ({
				images: [...state.images, [first, this.p5Canvas.elt.toDataURL(), similarities, wordStat]]
			}));
		}

	}

	// loads each image and associated mask -KK
	loadImages = async (images: string[]) => {
		const loadImageAsync = (name: string) => {
			return new Promise((resolve) => {
				this.state.mainP5.loadImage(`./assets/images/${name}.png`, (img: any) => {
					this.rawImg[name] = img;
					resolve(img);
				});
			});
		};
	
		await Promise.all(images.map(async (name) => {
			if (!this.rawImg[name]) {
				console.log("loading image: " + name.toString());
				await loadImageAsync(name);
			}
			if (!this.rawImg[name + "_mask"]) {
				console.log("loading mask: " + name.toString());
				await loadImageAsync(name + "_mask");
			}
		}));
	};
	
    componentDidMount() {
        this.state.mainP5 = new p5(this.Sketch, this.p5Ref.current);
	}

    componentWillUnmount() {
        this.state.mainP5.remove();
    }

	// Actually generate the image once the this.props.prompts list gets updated
    componentDidUpdate(prevProps: ImageGeneratorProps, prevState: ImageGeneratorState): void {
        if (prevState.images.length != this.state.images.length) {
            setTimeout(
				() => {this.candidateEndRef.current?.scrollIntoView(true)}
				, 0); // scroll to bottom list, setTimeOut because sometimes it doesn't scroll to the bottom
		}
	}

    render() {
		return (	
			<div className="candidateCol" >
				<div  style={{"visibility": "hidden", "position": "absolute", "top": "-9999px"}}>
					<div ref={this.p5Ref}
						className="p5Container"></div>
				</div>

				{this.state.images.map((img,index) => {
					return (
						<Candidate 
							inprompt={this.props.prompts[index]}
							similarities={img[2]}
							wordStat={img[3]}
                            imageurl={img[1]} 
							imgName={img[0]}
							imgData={this.imgData}
							imgButton = {this.imgButtonClicked}
							generateState = {this.props.generateState}

							dialogueRunner = {this.props.dialogueRunner}
							setDialogueVar  = {this.props.setDialogueVar}
							initiateScene = {this.props.initiateScene}
							fillPromptBox = {this.props.fillPromptBox}
														
                        	memorabilia={this.props.memorabilia}
                        	setMemorabilia={this.props.setMemorabilia}

							key={index}>

						</Candidate>
					)
				})}
				
				<div ref={this.candidateEndRef}></div>

			</div>

			);
	}
}

export default ImageGenerator;