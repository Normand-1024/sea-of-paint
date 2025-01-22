//@ts-ignore
import p5 from 'p5';
import React, {createRef} from 'react';

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
	if_tutorial: boolean;
    dialogueVar: Map<any, any>;
    setDialogueVar: Function;
	initiateScene: Function;
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

  Sketch = (p5:any) => {

		p5.preload = async () => {
			for (var imgd of IMAGE_DATA) {
				let name = imgd["name"];

				// Loading raw assets and populate image data by name
				this.rawImg[name] = p5.loadImage("./assets/images/" + name + ".png");
				this.rawImg[name + "_mask_1"] = p5.loadImage("./assets/images/" + name + "_mask_1" + ".png");
				this.imgData[name] = imgd;
				this.imgEmbed[name] = await this.st.embed(imgd["descp"]);
			}
			this.rawImg["noise"] = p5.loadImage("./assets/images/noise.png");
		}

		p5.setup = () => {
			this.p5Canvas = p5.createCanvas(IMAGE_DIM, IMAGE_DIM);

			p5.noStroke();
		}
   
		p5.draw = async () => {
			// Save image if the prompt list is updated
			if (this.props.prompts.length > 0 &&
				this.props.prompts.length-1 != this.state.currentP5Index) {

				this.state.currentP5Index = this.props.prompts.length-1; //locking

				let prompt = this.props.prompts[this.state.currentP5Index].toLowerCase();
				let prompt_embed = await this.st.embed(prompt);

				// get the similarity score for each image -KK
				let similarities = [];
				//console.log(this.props.prompts);
				for (let imgd of IMAGE_DATA) {
					let name = imgd["name"];

					// If during tutorial phase, don't show everything
					if (!this.props.if_tutorial || name == "lily" || imgd["interpretations"].length == 0){
						// compare it to the prompt to get the similarity -KK
						let similarity = this.st.cosineSimilarity(prompt_embed, this.imgEmbed[name]);
						similarities.push({name: name, score: similarity});
					}
				}

				// sort similarities in descending order -KK
				similarities.sort((a, b) => b.score - a.score);

				// check for keywords if the similarity is high enough -KK 
				let matched_keywords : Array<string> = ["","",""]
				if (this.props.dialogueVar.get(this.imgData[similarities[0].name]["path"]) &&
					similarities[0].score > HIGH_BOUND) {

					similarities[0].score = UNLOCK_SCORE;

				}


				// --------------------------------------- //
				// KEYWORD DETECTION AND REPLACEMENT BELOW //
				// --------------------------------------- //

				// are there supposed to be any parameters met before checking for keywords?
				// or is the image being top similarity enough? -KK
				
				let keywords = this.imgData[similarities[0].name]["keywords"]; 
				let fulldescp = this.imgData[similarities[0].name]["descp"]; 
				let placeholder = this.imgData[similarities[0].name]["descp2"]; 
			
				// iterate through the text to see if it matches any keywords
				// reveal prompt accordingly -KK
				let count = 1;
				for (let word of keywords) {
					let promptLower = prompt.toLowerCase();
					let wordLower = word[0].toLowerCase();
					console.log(prompt);

					// the below code works really elegantly but only for the first keyword :( -KK
					/*if (promptLower.includes(wordLower)) {
						console.log("keyword " + word + " detected in prompt");
						
						// find index of keyword -KK
						let index = fulldescp.toLowerCase().indexOf(wordLower);
						console.log(index);
						
						let before = placeholder.substring(0, index);
						let after = placeholder.substring(index + 3)
						placeholder = before + word + after;
						console.log("placeholder: " + placeholder);
	
						// update dialogue -KK
						const dialogueKey = this.imgData[similarities[0].name]["path"];
						this.props.setDialogueVar(dialogueKey, placeholder);
					}*/

					if (promptLower.includes(wordLower)) {
						console.log("keyword " + word + " detected in prompt");
						
						// count the number of occurrences of [?] to match word with the descp -KK
						let occurrenceIndex = -1;
						let occurrenceCount = 0;
						for (let i = 0; i < placeholder.length; i++) {
							if (placeholder.substring(i, i + 3) == "[?]") {
								occurrenceCount++; 
								if (count == occurrenceCount){
									occurrenceIndex = i;
									break;
								}
							}
						}
						console.log("[?] index: " + occurrenceIndex);
						
						let before = placeholder.substring(0, occurrenceIndex);
						let after = placeholder.substring(occurrenceIndex + 3)
						placeholder = before + word + after;
						console.log("new placeholder: " + placeholder);
	
						// update dialogue -KK
						const dialogueKey = this.imgData[similarities[0].name]["path"];
						this.props.setDialogueVar(dialogueKey, placeholder);
					}
					else{
						count++;
					}
				}
				
				p5.generateImage(similarities, matched_keywords);
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = async (similarities : Array<any>, matched_keywords : Array<string>) => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			let unlocked = false;
			img.loadPixels();

			// generate image based off of similarity score -KK
			// added logic: if the first image is not above HIGH_BOUND, then blend the first three images
			let first = "noise"; let second = "noise"; let mask = "noise";
			let filtered = similarities.filter(sim => sim.score > LOW_BOUND);

			if(similarities[0].score == UNLOCK_SCORE){
				first = similarities[0].name;
				unlocked = true;
			}
			else if(filtered.length > 0) { //similarities[0].score > HIGH_BOUND) {
				first = similarities[0].name;
				mask = first + "_mask_1";
			}

			if (filtered.length > 1) {
				second = similarities[1].name;
			}

			/*else if(filtered.length > 0){
				//let x = Math.floor(Math.random() * filtered.length);
				first = filtered[0].name;

				// Just randomly pick second image
				let y = Math.floor(Math.random() * similarities.length);
				while (y == 0){
					y = Math.floor(Math.random() * similarities.length);
				}
				second = similarities[y].name;

				mask = first + "_mask_1"; 	// adjust this to match the first image -KK
			}*/

			let raw1 : p5.Image = this.rawImg[first];
			if (unlocked){
				p5.image(raw1, 0, 0);
			}
			else{
				let raw2 : p5.Image = this.rawImg[second]; // raw2 is over raw1
				let raw1_mask : p5.Image = this.rawImg[mask];
				raw1.loadPixels();
				raw2.loadPixels();
				raw1_mask.loadPixels();

				copyOver(raw1, img);
				//randomCMYK(img);

				//	Use first two similarities to determine opacity of the top mask
				let score_ratio = similarities[0]["score"] / (similarities[0]["score"] + similarities[1]["score"]);
				let mask_opacity = Math.min(((score_ratio - 0.5) * 6), 1.0); // 0.5 - 0.65 -> 0.0 - 1.0
				//console.log(mask_opacity);

				// let hardlight_ratio = Math.max(0, Math.min(1.0, 
				// 	((similarities[0]["score"] - HIGH_BOUND - 0.1) / 0.2)
				// ))
				// hardlightBlend(img, raw2, img, hardlight_ratio);
				// cmykBlend(img, raw2, img, (1.0 - hardlight_ratio) * Math.min(mask_opacity + 0.5));
				// console.log([similarities[0]["score"], ((similarities[0]["score"] - LOW_BOUND - 0.1) / (HIGH_BOUND - LOW_BOUND)), hardlight_ratio]);

				//cmykBlend(img, raw2, img, mask_opacity * 0.5 + 0.5);
				cmykBlend(img, raw2, img, mask_opacity);
				hardlightBlend(img, raw2, img, 1 - mask_opacity);

				//normalBlend(img, raw1_mask, img, mask_opacity);		// normal blends mask over img
				cmykBlend(img, raw1_mask, img, mask_opacity);

				// brightness(img, score_ratio/HIGH_BOUND);						// implemented brightness here -KK
				// randomHue(img);												// implemented hue here -KK
				// saturation(img, (similarities[0]["score"] - HIGH_BOUND));  	// implemented saturation here -KK
																// implemented cmyk here -KK

				p5.image(img, 0, 0);
			}

			//p5.text(this.props.prompts[this.props.prompts.length-1], IMAGE_DIM/10, IMAGE_DIM/10);

			// Check if this image has been unlocked, set the variables in yarn
			// -2: not unlocked, -1: unlocked but waiting for interpretation
			if(this.props.dialogueVar.get(first) == -2 && unlocked){
				this.props.setDialogueVar(first, -1);
			}

			this.setState((state) => ({
				images: [...state.images, [first, this.p5Canvas.elt.toDataURL(), similarities, matched_keywords]]
			}));
		}

	}

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
							if_tutorial={this.props.if_tutorial}
							similarities={img[2]}
							matched_keywords={img[3]}
                            imageurl={img[1]} 
							imgName={img[0]}
							imgData={this.imgData}

							dialogueVar = {this.props.dialogueVar}
							setDialogueVar  = {this.props.setDialogueVar}
							initiateScene = {this.props.initiateScene}

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