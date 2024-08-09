//@ts-ignore
import p5 from 'P5';
import React, {createRef} from 'react';

import Candidate from './candidate';
import {normalBlend, overlayBlend} from '../functions/blending.tsx';

import '../App.css';


import {IMAGE_DIM} from '../constants.tsx';

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
		currentP5Index: -1
    };

    private p5Ref = createRef<HTMLDivElement>();
	private p5Canvas : any;
    private candidateEndRef = createRef<HTMLDivElement>();

	private rawImg : { [id: string] : any; } = {};

    Sketch = (p5:any) => {

		p5.preload = () => {
			// Loading all raw assets
			this.rawImg['1'] = p5.loadImage("public/assets/images/1.png");
			this.rawImg['2'] = p5.loadImage("public/assets/images/2.png");
		}

		p5.setup = () => {
			this.p5Canvas = p5.createCanvas(IMAGE_DIM, IMAGE_DIM);

			p5.noStroke();
		}
   
		p5.draw = () => {
			// Save image if the prompt list is updated
			if (this.props.prompts.length > 0 &&
				this.props.prompts.length-1 != this.state.currentP5Index) {

				this.state.currentP5Index = this.props.prompts.length-1; //locking

				p5.generateImage();
				this.setState((state) => ({
					images: [...state.images, this.p5Canvas.elt.toDataURL()]
				}));
			}
		}

		// ********************************
		// Actual image generation function
		// ********************************
		p5.generateImage = () => {
			p5.background('white');

			let img : p5.Image = p5.createImage(500, 500);
			img.loadPixels();

			let raw1 : p5.Image = this.rawImg['1'];
			let raw2 : p5.Image = this.rawImg['2']; // raw2 is over raw1
			raw1.loadPixels();
			raw2.loadPixels();

			overlayBlend(raw1, raw2, img);

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
				, 0); // scroll to bottom list, setTimeOut because sometimes it does scroll to the bottom
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
							imageurl={url} key={index}></Candidate>
					)
				})}
				
				<div ref={this.candidateEndRef}></div>

			</div>

			);
	}
}

export default ImageGenerator;