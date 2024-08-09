//@ts-ignore
import p5 from 'P5';
import React, {createRef} from 'react';

import '../App.css';


type PaintingProps = {
    pageState: number;
    setPageState: Function;
}

type PaintingState = {
    mainP5: any;
}

class PaintingPage extends React.Component<PaintingProps, PaintingState> {
    state: PaintingState = {
        mainP5: undefined
    };

    private p5Ref = createRef<HTMLDivElement>();

    Sketch = (p5:any) => {

		p5.setup = () => {
			p5.createCanvas(p5.windowWidth / 2, p5.windowWidth / 2);
			
			//stars = p5.loadImage("./assets/stars.png");

			p5.noStroke();
		}
   
		p5.draw = () => {
			p5.background(24, 29, 39);
		}

		p5.windowResized = () => {
			p5.resizeCanvas(p5.windowWidth / 2, p5.windowWidth / 2);
		}

		p5.mouseClicked = () => {
		}
	}

    componentDidMount() {
        this.state.mainP5 = new p5(this.Sketch, this.p5Ref.current);
	}
    componentWillUnmount() {
        this.state.mainP5.remove();
    }

    render() {
		return (	
			<div id="paintingPage" >
				<div ref={this.p5Ref}
					className="p5Container"></div>
			</div>

			);
	}
}

export default PaintingPage;