import React, {useEffect} from 'react';
import '../App.css'

import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';

type CandidateProps = {
    inprompt: string;
    imgName: string;
    imageurl: string;
    imgData: { [id: string] : any; };
    
    dialogueVar: Map<any, any>;
    setDialogueVar: Function;
}

type CandidateState = {
}

export class Candidate extends React.Component<CandidateProps, CandidateState> {
    state: CandidateState = {
        imageurl: "public/assets/images/placeholder.jpg"
    }

    render() {

        // check if paths to unlocked the image has been traversed
        let imgName = this.props.imgName;
        let filtered = imgName == "noise" ? undefined : this.props.imgData[imgName]["path"].filter((n: string) => this.props.dialogueVar.get(n) == true);
        let traversed = filtered && filtered.length > 0;

        return (
            <div className = "candidate">

                <img src={this.props.imageurl} style={{'width': '100%'}}></img>
                <p style={{'marginTop': 0, 'color': 'gray', 'fontStyle': 'italic'}}>"{this.props.inprompt}"</p>
                
                <p style={{'marginTop': 0}}>
                    {this.props.imgName == "noise" ? "The Machine returned a noise, the Sea does not know how to respond." 
                        : this.props.imgData[this.props.imgName]["info"]}
                </p>

                {  // | noise or not unlockable | not yet traversed | traversed not unlocked | interpreted | unlocked not interpreted
                    (imgName == "noise" || this.props.imgData[imgName]["path"].length == 0) ? <p style={{'display':'none'}}></p> :
                        !traversed ? <p style={{'marginTop': 0}}>This is Mey's core memory, but tainted by another imagery. I don't have the words to unlock the authentic image yet.</p> :
                            this.props.dialogueVar.get(imgName) == -2 ? <p style={{'marginTop': 0}}>This is Mey's core memory, but tainted by another imagery. I should have the words to unlock it now, but it's not entered correctly. </p> :
                                this.props.dialogueVar.get(imgName) > -1 ? <p style={{'marginTop': 0}}>{this.props.imgData[imgName]["interpretations"][this.props.dialogueVar.get(imgName)][1]}</p> :
                                    
                                // The buttons for interpretations
                                <div>
                                {   
                                    this.props.imgData[imgName]["interpretations"].map(
                                        (op:any,i:number) => {                      
                                            return (
                                                <div key={i}><button key={i} type="button"
                                                    style={{'marginBottom': '1%'}}
                                                    onClick = {() => this.props.setDialogueVar(imgName, i)}>
                                                    {op[0]}
                                                </button></div>
                                            );
                                    }) 
                                }
                            </div>
                }

            </div>
        )
    }
};

    
export default Candidate;