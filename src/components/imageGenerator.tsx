//@ts-ignore
import p5 from 'p5';
import React, {createRef} from 'react';
import { Story } from 'inkjs';

import Candidate from './candidate';
import SentenceTransformer from '../functions/sentenceTransformer.tsx';
import { normalBlend, overlayBlend, hardlightBlend, cmykBlend } from '../functions/blending.tsx';
import { brightness, randomCMYK, randomHue, saturation, copyOver } from '../functions/imageProcessing.tsx';

import '../App.css';

import { IMAGE_DIM, HIGH_BOUND, LOW_BOUND } from '../constants.tsx';
import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';

let UNLOCK_SCORE = 1.2;

type ImageGeneratorProps = {
	prompts: Array<string>;
    dialogueRunner: Story;
    setDialogueVar: Function;
	initiateScene: Function;
	generateState: number;
	fillPromptBox: Function;
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

				let prompt = this.props.prompts[this.state.currentP5Index].toLowerCase();
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
				if (similarities[0].score > HIGH_BOUND) {
					similarities[0].score = UNLOCK_SCORE;
				}

				console.log(similarities);

				// ----------------- //
				// KEYWORD DETECTION //
				// ----------------- //
				let keywords = this.imgData[similarities[0].name]["keywords"]; 
				let wordStat = this.imgWordStat[similarities[0].name];
			
				let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.imgData[similarities[0].name]["scene"]);

				if (visit_count == null || visit_count == undefined)
					console.log("WARNING: VISIT_COUNT IS NULL OR UNDEFINED");
				else if (visit_count > 0){
					for (let i=0; i<wordStat.length; i++) {
						if (wordStat[i]) continue;
						for (let j=0; j < keywords[i].length; j++){
							if (prompt.includes(keywords[i][j].toLowerCase())){
								wordStat[i] = true;
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
			let first = "noise"; let second = "noise"; let mask = "noise";
			let filtered = similarities.filter(sim => sim.score > LOW_BOUND);

			if(similarities[0].score == UNLOCK_SCORE){
				first = similarities[0].name;
				unlocked = true;
			} else if(filtered.length > 0) { 
				first = similarities[0].name;
				mask = first + "_mask_1";
			}

			if (filtered.length > 1) {
				second = similarities[1].name;
			}

			let raw1 : p5.Image = this.rawImg[first];
			if (unlocked){
				p5.image(raw1, 0, 0);
			}
			else{
				let raw2 : p5.Image = this.rawImg[second]; // raw2 is over raw1
				let raw1_mask : p5.Image = this.rawImg[mask];
				
				raw1.loadPixels();
				raw2.loadPixels();
				// raw2.filter(p5.GRAY);
				raw1_mask.loadPixels();

				copyOver(raw1, img);

				//	Use first two similarities to determine opacity of the top mask
				let score_ratio = similarities[0]["score"] / (similarities[0]["score"] + similarities[1]["score"]);
				let mask_opacity = Math.min(((score_ratio - 0.5) * 6), 1.0); // 0.5 - 0.65 -> 0.0 - 1.0
				
				cmykBlend(img, raw2, img, mask_opacity);
				hardlightBlend(img, raw2, img, 1 - mask_opacity);
				cmykBlend(img, raw1_mask, img, mask_opacity);

				p5.image(img, 0, 0);
			}

			// Check if this image has been unlocked, set the variables in yarn
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
			if (!this.rawImg[name + "_mask_1"]) {
				console.log("loading mask: " + name.toString());
				await loadImageAsync(name + "_mask_1");
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
			<div id="candidateCol" >
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