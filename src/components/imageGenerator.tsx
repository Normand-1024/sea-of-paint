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
	similarities: Array<{name: string, score: number}>; // adding similarities to the state -KK
}

class ImageGenerator extends React.Component<ImageGeneratorProps, ImageGeneratorState> {
    state: ImageGeneratorState = {
        mainP5: undefined,
		images: [],
		currentP5Index: -1,
		similarities: []  
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
			}

			// *************************************
			// Importing new images for masking -KK
			// *************************************
			this.rawImg['1'] = p5.loadImage("/assets/images/cat_base.png");
			this.rawImg['2'] = p5.loadImage("/assets/images/tiger.png");
			this.rawImg['3'] = p5.loadImage("/assets/images/cat_mask.png");
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
				this.setState({similarities});
				
				// print as window alert to debug -KK
				// let similarity_message = similarities.map(sim => `${sim.name}: ${sim.score}`).join('\n');
				// window.alert("Sorted similarities:\n" + similarity_message);

				console.log("Sorted similarities: ", similarities);
				// console.log(this.st.cosineSimilarity(prompt_embed, this.imgEmbed["1"]));

				p5.generateImage();
				this.setState((state) => ({
					images: [...state.images, this.p5Canvas.elt.toDataURL()]
				}));
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = async () => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			img.loadPixels();

			// generate image based off of similarity score -KK
			let first = "noise"; let second = "noise"; let mask = "noise";
			if(this.state.similarities[0].score > HIGH_BOUND && this.state.similarities[1].score > HIGH_BOUND){			
				// good similarity, blend these two images
				first = this.state.similarities[0].name;
				second = this.state.similarities[1].name;
				mask = "city_mask_1";	// adjust this to match the first image -KK
			}
			else if(this.state.similarities[0].score > LOW_BOUND && this.state.similarities[1].score > LOW_BOUND){	
				// some similarity, choose random images with score above 0.2
				let filtered = this.state.similarities.filter(sim => sim.score > 0.2);
				
				let x = Math.floor(Math.random() * filtered.length);
				let y = Math.floor(Math.random() * filtered.length);
				while (x == y){
					y = Math.floor(Math.random() * filtered.length);
				}

				first = filtered[x].name;
				second = filtered[y].name;
				mask = "city_mask_1"; 	// adjust this to match the first image -KK
			}

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