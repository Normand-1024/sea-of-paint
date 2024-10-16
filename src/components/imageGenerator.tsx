//@ts-ignore
import p5 from 'P5';
import React, {createRef} from 'react';

import Candidate from './candidate';
import SentenceTransformer from '../functions/sentenceTransformer.tsx';
import {normalBlend, overlayBlend, hardlightBlend} from '../functions/blending.tsx';

import '../App.css';

import {IMAGE_DIM, HIGH_BOUND, LOW_BOUND} from '../constants.tsx';
import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';

type ImageGeneratorProps = {
	prompts: Array<string>;
}

type ImageGeneratorState = {
    mainP5: any;
	images: Array<string>;
	currentP5Index: number;
}

class ImageGenerator extends React.Component<ImageGeneratorProps, ImageGeneratorState> {
    state: ImageGeneratorState = {
        mainP5: undefined,
		images: [],
		currentP5Index: -1,
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
				this.rawImg[name] = p5.loadImage("/assets/images/" + name + ".png");
				this.imgData[name] = imgd;
				this.imgEmbed[name] = await this.st.embed(imgd["descp"]);
				for(let i = 1; i <= imgd["masks"]; i++){
					this.rawImg[name + "_mask_" + i] = p5.loadImage("/assets/images/" + name + "_mask_" + i + ".png");
					console.log(name + "_mask_" + i + " is loaded.");
				}
			}
			this.rawImg["noise"] = p5.loadImage("/assets/images/noise.png");
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
					let keywords = imgd["keywords"];

					// compare it to the prompt to get the similarity -KK
					let similarity = this.st.cosineSimilarity(prompt_embed, this.imgEmbed[name]);

					// see if the prompt contains the keywords
					if (similarity > HIGH_BOUND && 
						prompt.includes(keywords[0]) && 
						prompt.includes(keywords[1]) && 
						prompt.includes(keywords[2])) {
							similarities.push({name: name, score: 1.0});
					}
					else{
						similarities.push({name: name, score: similarity});
					}
				}

				// sort similarities in descending order -KK
				similarities.sort((a, b) => b.score - a.score);
				console.log("Sorted similarities: ", similarities);

				p5.generateImage(similarities);
				this.setState((state) => ({
					images: [...state.images, this.p5Canvas.elt.toDataURL()]
				}));
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = (similarities: Array<{ name: string, score: number }>) => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			img.loadPixels();

			// generate image based off of similarity score -KK
			let first = "noise"; let second = "noise"; let mask = "noise";
			if(similarities.length > 0){
				if(similarities[0].score == 1.0){
					mask = similarities[0].name;
				}
				else if(similarities[0].score > HIGH_BOUND && similarities[1].score > HIGH_BOUND){			
					// good similarity, blend these two images
					first = similarities[0].name;
					second = similarities[1].name;
					mask = first + "_mask_1";	// need to implement random mask selection -KK
				}
				else if(similarities[0].score > LOW_BOUND && similarities[1].score > LOW_BOUND){	
					// some similarity, choose random images with score above the low bound -KK
					let filtered = similarities.filter(sim => sim.score > LOW_BOUND);
					
					let x = Math.floor(Math.random() * filtered.length);
					let y = Math.floor(Math.random() * filtered.length);
					while (x == y){
						y = Math.floor(Math.random() * filtered.length);
					}

					first = filtered[x].name;
					second = filtered[y].name;
					mask = first + "_mask_1";
				}
			}

			let raw1 : p5.Image = this.rawImg[first];
			let raw2 : p5.Image = this.rawImg[second]; // raw2 is over raw1
			let raw1_mask : p5.Image = this.rawImg[mask];
			raw1.loadPixels();
			raw2.loadPixels();
			raw1_mask.loadPixels();

			// randomize blending -KK
			let blend = Math.floor(Math.random() * 3);
			console.log("Blending method: " + blend);
			if(blend == 0) normalBlend(raw1, raw2, img);
			if(blend == 1) overlayBlend(raw1, raw2, img);
			if(blend == 2) hardlightBlend(raw1, raw2, img);
			normalBlend(img, raw1_mask, img);		// normal blends mask over img

			p5.image(img, 0, 0);

			p5.text(this.props.prompts[this.props.prompts.length-1], IMAGE_DIM/10, IMAGE_DIM/10);
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

				
				{this.state.images.map((url,index) => {
					return (
						<Candidate inprompt={this.props.prompts[index]}
                            imageurl={url}></Candidate>
					)
				})}
				
				<div ref={this.candidateEndRef}></div>

			</div>

			);
	}
}

export default ImageGenerator;