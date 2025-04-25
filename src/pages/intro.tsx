import React from 'react';

import '../App.css';

import {PAGE_STATE} from '../constants.tsx';

const INTRO_TEXT = [
    "The Sea is everywhere, all around us. Every minute, traces of ourselves dissolve into the man-made Sea. A whole continuously breaks into parts to become the Whole again.",
    "Machines were developed to harness the Sea. Machines that bring back spirits. Machines that can produce words like a person. Machines that can turn words into images.",
    "I'm an operator of these Machines. As per the grieving's request, I am contracted to temporarily bring back the deceased.",
    "Just have to remind myself first: the beginning is always the hardest. Be patient and be kind."
  ];

type IntroProps = {
    pageState: number;
    setPageState: Function;
}

type IntroState = {
    currentLine: number;
}

class IntroPage extends React.Component<IntroProps, IntroState> {

    state: IntroState = {
        currentLine: 0
    };

    advanceIntro = () => {
        this.setState((state) => ({
            currentLine: state.currentLine + 1
        }));
    }

    nextPage = () => {
        this.props.setPageState(PAGE_STATE['machine']);
    }

    render() {
        return (
            <div id="storyPage">

                <h1>Sea of Paint</h1>
            
                {INTRO_TEXT.map((item,index) => {
                    return (
                        index <= this.state.currentLine ? 
                            <p key={index} style={{'color': 'black'}}>{item}</p> :
                            <p key={index} className="no-select"
                                    style={{'color': 'white'}}>{item}</p>
                    )
                })}

                {this.state.currentLine < INTRO_TEXT.length - 1 ? 
                    <button onClick = {this.advanceIntro}>Continue</button> : 
                    <button onClick = {this.nextPage}>Start</button>
                }

            </div>
        );
    }
}

export default IntroPage;
