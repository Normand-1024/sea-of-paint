//@ts-ignore
import p5 from 'p5';
import React, {createRef} from 'react';

import Candidate from './candidate';
import SentenceTransformer from '../functions/sentenceTransformer.tsx';
import {normalBlend, overlayBlend, hardlightBlend} from '../functions/blending.tsx';

import '../App.css';

import {IMAGE_DIM, HIGH_BOUND, LOW_BOUND} from '../constants.tsx';
import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';

type ImageGeneratorProps = {
	prompts: Array<string>;
    dialogueVar: Map<any, any>;
    setDialogueVar: Function;
}

type ImageGeneratorState = {
    mainP5: any;
	images: Array<Array<string>>;
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
	private imgData: { [id: string] : any; } = {}; // [image descriptions, [3 keywords], questions]
	private imgEmbed: { [id: string] : any; } = {}; // Embeddings for each image

  Sketch = (p5:any) => {

		p5.preload = async () => {
			for (var imgd of IMAGE_DATA) {
				let name = imgd["name"];

				// Loading raw assets and populate image data by name
				this.rawImg[name] = p5.loadImage("./public/assets/images/" + name + ".png");
				this.rawImg[name + "_mask_1"] = p5.loadImage("./public/assets/images/" + name + "_mask_1" + ".png");
				this.imgData[name] = imgd;
				this.imgEmbed[name] = await this.st.embed(imgd["descp"]);
			}
			this.rawImg["noise"] = p5.loadImage("./public/assets/images/noise.png");

			// // *************************************
			// // Importing new images for masking -KK
			// // *************************************
			// this.rawImg['1'] = p5.loadImage("/assets/images/cat_base.png");
			// this.rawImg['2'] = p5.loadImage("/assets/images/tiger.png");
			// this.rawImg['3'] = p5.loadImage("/assets/images/cat_mask.png");
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

				let prompt = this.props.prompts[this.state.currentP5Index];
				let prompt_embed = await this.st.embed(prompt);

				// get the similarity score for each image -KK
				let similarities = [];
				for (let imgd of IMAGE_DATA) {
					let name = imgd["name"];
					// compare it to the prompt to get the similarity -KK
					let similarity = this.st.cosineSimilarity(prompt_embed, this.imgEmbed[name]);
					similarities.push({name: name, score: similarity});
				}

				// sort similarities in descending order -KK
				similarities.sort((a, b) => b.score - a.score);
				
				// print as window alert to debug -KK
				// let similarity_message = similarities.map(sim => `${sim.name}: ${sim.score}`).join('\n');
				// window.alert("Sorted similarities:\n" + similarity_message);

				console.log("Sorted similarities: ", similarities);
				// console.log(this.st.cosineSimilarity(prompt_embed, this.imgEmbed["1"]));

				p5.generateImage(similarities);
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = async (similarities : Array<any>) => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			img.loadPixels();

			// console.log(similarities);
			// console.log(this.rawImg);

			// generate image based off of similarity score -KK
			let first = "noise"; let second = "noise"; let mask = "noise";

			if(similarities[0].score > HIGH_BOUND && similarities[1].score > HIGH_BOUND){			
				// good similarity, blend these two images
				first = similarities[0].name;
				second = similarities[1].name;
				mask = similarities[0].name + "_mask_1";	// adjust this to match the first image -KK
			}
			else if(similarities[0].score > LOW_BOUND && similarities[1].score > LOW_BOUND){	
				// some similarity, choose random images with score above 0.2
				let filtered = similarities.filter(sim => sim.score > LOW_BOUND);
				
				let x = Math.floor(Math.random() * filtered.length);
				let y = Math.floor(Math.random() * filtered.length);
				while (x == y){
					y = Math.floor(Math.random() * filtered.length);
				}

				first = filtered[x].name;
				second = filtered[y].name;
				mask = filtered[x].name + "_mask_1"; 	// adjust this to match the first image -KK
			}

			// console.log([first, second, mask]);

			let raw1 : p5.Image = this.rawImg[first];
			let raw2 : p5.Image = this.rawImg[second]; // raw2 is over raw1
			let raw1_mask : p5.Image = this.rawImg[mask];
			raw1.loadPixels();
			raw2.loadPixels();
			raw1_mask.loadPixels();

			hardlightBlend(raw1, raw2, img);		// hardlight blends raw2 over raw1
			// make blending random (hardlight, overlay, softlight, etc)
			normalBlend(img, raw1_mask, img);		// normal blends mask over img

			p5.image(img, 0, 0);

			//p5.text(this.props.prompts[this.props.prompts.length-1], IMAGE_DIM/10, IMAGE_DIM/10);

			// Check if this image has been unlocked, set the variables in yarn
			// -2: not unlocked, -1: unlocked but waiting for interpretation
			if(this.props.dialogueVar.get(first) == -2){
				this.props.setDialogueVar(first, -1);
			}

			this.setState((state) => ({
				images: [...state.images, [first, this.p5Canvas.elt.toDataURL()]]
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
                            imageurl={img[1]} 
							imgName={img[0]}
							imgData={this.imgData}

							dialogueVar = {this.props.dialogueVar}
							setDialogueVar  = {this.props.setDialogueVar}
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