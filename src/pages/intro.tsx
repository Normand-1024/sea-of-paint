import React from 'react';

import '../styles/intro.css'
import { PAGE_STATE } from '../constants.tsx';
// import Button from '@mui/material/Button';

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
  isVisible: boolean;
}

class IntroPage extends React.Component<IntroProps, IntroState> {
  state: IntroState = {
    currentLine: 0,
    isVisible: false,
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ isVisible: true });
    });
  }

  advanceIntro = () => {
    this.setState((state) => ({
      currentLine: state.currentLine + 1
    }));
  }

  nextPage = () => {
    this.props.setPageState(PAGE_STATE['machine']);
  }

  render() {
    const { currentLine, isVisible } = this.state;

    return (
      <div id="storyPage" className={isVisible ? 'visible' : ''}>
        
        {INTRO_TEXT.map((item, index) => (
          <p key={index} className={index <= currentLine ? '' : 'inactive-line'}>
            {item}
          </p>
        ))}

        <br></br>
        <br></br>

        <div className="intro-button-container">
        {currentLine < INTRO_TEXT.length - 1 ? (
            <button onClick={this.advanceIntro} className="intro-button">
                Continue
            </button>
        ) : (
            <button onClick={this.nextPage} className="intro-button">
                Start
            </button>
        )}
        </div>
      </div>
    );
  }
}

export default IntroPage;
