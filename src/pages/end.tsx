import React from 'react';
import { PAGE_STATE } from '../constants.tsx';
import '../styles/end.css';

const MEMORY_DATA = [
  { image: './assets/images/lily.png', text: 'sample text #1' },
  { image: './assets/images/lily.png', text: 'sample text #2' },
  { image: './assets/images/lily.png', text: 'pretend this one is long, like super super long, just lots of text that keeps going without stopping blah blah blahhhhh' },
];

const FINAL_TEXT = [
  "The Sea is everywhere, all around us. Every minute, traces of ourselves dissolve into the man-made Sea. A whole continuously breaks into parts to become the Whole again.",
  "example line 2",
  "example line 3",
  "example line 4"
];

type EndProps = {
  pageState: number;
  setPageState: Function;
}

type EndState = {
  visibleMemories: number;
  currentLine: number;
}

class EndPage extends React.Component<EndProps, EndState> {
  state: EndState = {
    visibleMemories: 0,
    currentLine: -1,
  };

  advanceFinal = () => {
    this.setState((state) => ({
      currentLine: state.currentLine + 1
    }));
  }

 handleContinue = () => {
    if (this.state.visibleMemories < MEMORY_DATA.length) {
      this.setState({ visibleMemories: this.state.visibleMemories + 1 });
    } else if (this.state.currentLine < FINAL_TEXT.length - 1) {
      this.setState({ currentLine: this.state.currentLine + 1 });
    } else {
      this.props.setPageState(PAGE_STATE['menu']);
      // KK: reset any other game data below
      this.setState({
        visibleMemories: 0,
        currentLine: -1
      });
    }
  };

  getButtonText = () => {
    if (this.state.visibleMemories < MEMORY_DATA.length) {
      return 'Continue';
    } else if (this.state.currentLine < FINAL_TEXT.length - 1) {
      return 'Show Next Line';
    } else {
      return 'Reset Game';
    }
  };

  render() {
    const { visibleMemories, currentLine } = this.state;

    return (
      <div className="end-wrapper">
        <div className="title-wrapper">
          <h1>Memorabilia</h1>
        </div>

        <div className="memorabilia-wrapper">
          {MEMORY_DATA.map((item, index) => (
            <div
              key={index}
              className={`memory-wrapper ${index < visibleMemories ? 'visible' : ''}`}
            >
              <img className="image" src={item.image} alt={`Memory ${index + 1}`} />
              <p className="text">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="final-text-wrapper">
          {currentLine >= 0 && currentLine < FINAL_TEXT.length && (
            <p>{FINAL_TEXT[currentLine]}</p>
          )}
        </div>

        <div className="button-wrapper">
          <button onClick={this.handleContinue} className="button">
            {this.getButtonText()}
          </button>
        </div>
      </div>
    );
  }
}

export default EndPage;
