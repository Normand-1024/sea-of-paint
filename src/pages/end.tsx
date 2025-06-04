import React from 'react';
import { PAGE_STATE } from '../constants.tsx';
import '../styles/end.css';

import { IMAGE_DATA, IMAGE_INDEX } from '../../public/assets/images/imageData.tsx';

const FINAL_TEXT = [
  "\"Thank you...this is beautiful.\"",
  "\"Maybe this will convince dad...that the Sea is not as twisted as he thinks.\"",
  "\"I don't know if I'll ever forgive him for pushing to do this...\"",
  "\"...she's really gone now...\"",
  "\"...anyway, thanks again.\"",
  "\"Goodbye.\"",
  ];

type EndProps = {
    pageState: number;
    setPageState: Function;
    memorabilia: (string | number)[][]; // [id1, id2, interpt1, interpt2, imageURL] x 3
}

type EndState = {
  memCount: number;
  visibleMemories: number;
  currentLine: number;
  isVisible: boolean;
}

class EndPage extends React.Component<EndProps, EndState> {
  state: EndState = {
    memCount: (this.props.memorabilia.filter(function(element){
                        return element[0] != "";})).length,
    visibleMemories: 0,
    currentLine: -1,
    isVisible: false
  };

  // private imgData: { [id: string] : any; } = {}; // name : all other data in IMAGE_DATA

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ isVisible: true });
    });
  }

  advanceFinal = () => {
    this.setState((state) => ({
      currentLine: state.currentLine + 1
    }));
  }

 handleContinue = () => {
    if (this.state.visibleMemories < this.state.memCount) {
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
    if (this.state.visibleMemories < this.state.memCount) {
      return 'Continue';
    } else if (this.state.currentLine < FINAL_TEXT.length - 1) {
      return 'Continue';
    } else {
      return 'End Game';
    }
  };

  render() {
    const { visibleMemories, currentLine } = this.state;
    // console.log(this.props.memorabilia);

    return (
      <div className={`end-wrapper ${this.state.isVisible ? 'visible' : ''}`}>
        {/* <div className="title-wrapper">
          <h1>Memorabilia</h1>
        </div> */}

        <div className="memorabilia-wrapper">
          {this.props.memorabilia.map((item, index) => (
            // <div
            //   key={index}
            //   className={`memory-wrapper ${index < visibleMemories ? 'visible' : ''}`}
            // >
            //   <img className="image" src={item.image} alt={`Memory ${index + 1}`} />
            //   <p className="text">{item.text}</p>
            // </div>
            <div className={`memory-wrapper 
                            ${item[0] == '' ? 'noMem'
                              : index < visibleMemories ? 'visible' : ''}`} key={index}>
              {item[0] != '' && <img className="image" src={item[4].toString()}/>}
              {item[0] != '' && <div className="interpret-line-gold">{IMAGE_DATA[IMAGE_INDEX[item[0]]]["memorabilia"][item[2]] + ", and she" +
                                  IMAGE_DATA[IMAGE_INDEX[item[1]]]["memorabilia"][item[3]].slice(3)}.</div>}
            </div>
            
          ))}

          <div className={`final-text-wrapper ${this.state.currentLine < 0 ? '' : 'visible'}`}>
            {FINAL_TEXT.map((item, index) => (
              <p key={index} className={index <= currentLine ? '' : 'inactive-line'}>
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* <div className="final-text-wrapper">
          {FINAL_TEXT.map((item, index) => (
            <p key={index} className={index <= currentLine ? '' : 'inactive-line'}>
              {item}
            </p>
          ))}
        </div> */}

        <div className="end-button-wrapper">
          <button onClick={this.handleContinue} className="end-button">
            {this.getButtonText()}
          </button>
        </div>
      </div>
    );
  }
}

export default EndPage;

// function EndPage({ pageState, setPageState, memorabilia }: EndPageProps) {
  
//     let imgData: { [id: string] : any; } = {}; // name : all other data in IMAGE_DATA
//     for (var imgd of IMAGE_DATA) {
//           let name = imgd["name"];
//           imgData[name] = imgd;
//     }

//     memorabilia[0] = ['lily', 'lily2', 0, 0, "./assets/images/ivan2.png"];

//   return (
//     <div className="end-wrapper">
//       <h1>End Game Screen</h1>

//       <div className="memorabilia-wrapper">
//         {memorabilia.map((item, index) => (
//             <div className="memory-wrapper" key={index}>
//               {item[0] != "" && <img className="image" src={item[4].toString()}/>}
//               {item[0] != "" && <p className="text">{imgData[item[0]]["memorabilia"][item[2]] + ", and she" +
//                                   imgData[item[1]]["memorabilia"][item[3]].slice(3)}.</p>}
//             </div>
//         ))}
// =======
/* const MEMORY_DATA = [
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
} */

// type EndState = {
//   visibleMemories: number;
//   currentLine: number;
// }

// class EndPage extends React.Component<EndProps, EndState> {
//   state: EndState = {
//     visibleMemories: 0,
//     currentLine: -1,
//   };

//   advanceFinal = () => {
//     this.setState((state) => ({
//       currentLine: state.currentLine + 1
//     }));
//   }

//  handleContinue = () => {
//     if (this.state.visibleMemories < MEMORY_DATA.length) {
//       this.setState({ visibleMemories: this.state.visibleMemories + 1 });
//     } else if (this.state.currentLine < FINAL_TEXT.length - 1) {
//       this.setState({ currentLine: this.state.currentLine + 1 });
//     } else {
//       this.props.setPageState(PAGE_STATE['menu']);
//       // KK: reset any other game data below
//       this.setState({
//         visibleMemories: 0,
//         currentLine: -1
//       });
//     }
//   };

//   getButtonText = () => {
//     if (this.state.visibleMemories < MEMORY_DATA.length) {
//       return 'Continue';
//     } else if (this.state.currentLine < FINAL_TEXT.length - 1) {
//       return 'Show Next Line';
//     } else {
//       return 'Reset Game';
//     }
//   };

//   render() {
//     const { visibleMemories, currentLine } = this.state;

//     return (
//       <div className="end-wrapper">
//         <div className="title-wrapper">
//           <h1>Memorabilia</h1>
//         </div>

//         <div className="memorabilia-wrapper">
//           {MEMORY_DATA.map((item, index) => (
//             <div
//               key={index}
//               className={`memory-wrapper ${index < visibleMemories ? 'visible' : ''}`}
//             >
//               <img className="image" src={item.image} alt={`Memory ${index + 1}`} />
//               <p className="text">{item.text}</p>
//             </div>
//           ))}
//         </div>

//         <div className="final-text-wrapper">
//           {currentLine >= 0 && currentLine < FINAL_TEXT.length && (
//             <p>{FINAL_TEXT[currentLine]}</p>
//           )}
//         </div>

//         <div className="button-wrapper">
//           <button onClick={this.handleContinue} className="button">
//             {this.getButtonText()}
//           </button>
//         </div>
// >>>>>>> 340e3dba341bd5a9de7b5347110571553f3ea41c
//       </div>
//     );
//   }
// }

// export default EndPage;
