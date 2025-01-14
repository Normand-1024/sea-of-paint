import React, {useEffect} from 'react';
import '../App.css'

import {IMAGE_DIM, HIGH_BOUND, LOW_BOUND} from '../constants.tsx';
import { match } from 'assert';

type CandidateProps = {
    inprompt: string;
    similarities: Array<any>;
    matched_keywords: Array<string>;
    imgName: string;
    imgName2: string;
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

    getMemInfo(image_name : string, image_score: number) {
        let output : string = this.props.imgData[image_name].memory_name;

        if (this.props.imgData[image_name]["path"].length > 0 && this.props.dialogueVar.get(image_name) == -2) {
            output += "?";
        }

        output += " --- ";
        
        if (image_score < LOW_BOUND) output += "Too Dissonant";
        else output += this.distanceFunc(image_score);

        return output;
    }

    getKeywordString() {
        let output = "";
        for (let wrd of this.props.matched_keywords) output += "[\"" + wrd + "\"]";
        return output;
    }

    getDistanceString(i : number, imgName : string, score : number, is_unlockable : boolean) {
        if (i > 1) {
            return (this.getMemInfo(imgName, score));
        }
        else if (i == 1) {
            if (score > LOW_BOUND) return (<b>{this.getMemInfo(imgName, score)}</b>);
            else return (this.getMemInfo(imgName, score));
        }
        else{
            if (!is_unlockable) 
                return (<b>{this.getMemInfo(imgName, score)}</b>);
            else if (score < HIGH_BOUND) 
                return (<div>
                            <b>{this.getMemInfo(imgName, score)}</b>
                            <p className = "notif">Refine description to reach {this.distanceFunc(HIGH_BOUND)}</p>
                        </div>);
            else if (this.props.matched_keywords.filter(wrd => wrd != "").length == 0) 
                return (<div>
                            <b>{this.getMemInfo(imgName, score)}</b>
                            <p className = "notif">Core memory tainted. No keywords found</p>
                        </div>);
            else 
                return (<div>
                            <b>{this.getMemInfo(imgName, score)}</b>
                            <p className = "notif">Matched keywords: {this.getKeywordString()}</p>
                        </div>);

        }
    }

    distanceFunc(score : number) {
        return (Math.round((score) * 10000) / 100).toString() + "%";
    }

    render() {

        // check if paths to unlocked the image has been traversed
        let imgName = this.props.imgName;
        let imgName2 = this.props.imgName2;
        let is_unlockable = this.props.imgData[imgName]["path"].length > 0;
        let matched = this.props.matched_keywords.filter(wrd => wrd != "").length == 3;

        return (
            <div className = "candidate">

                <img src={this.props.imageurl} style={{'width': '100%'}}></img>
                <p style={{'marginTop': 0, 'color': 'gray', 'fontStyle': 'italic'}}>"{this.props.inprompt}"</p>
                
                {/* { // | noise | not core or interpreted | core (not in distance) | core (keyword)
                
                this.props.imgName == "noise"                       ? <p style={{'marginTop': 0}}>The Machine returned a noise, the Sea does not know how to respond.</p>
                : !is_unlockable || (is_unlockable &&
                    this.props.dialogueVar.get(imgName) > -1)       ? <p style={{'marginTop': 0}}></p>
                : this.props.similarities[0]["score"] < HIGH_BOUND  ? 
                    <p style={{'marginTop': 0}}>{"The closest is Mey's core memory, but it is still too far. Refine the description and get closer than " + this.distanceFunc(HIGH_BOUND) + "."}</p>
                : <div>
                    <p style={{'marginTop': 0}}> {"The closest is Mey's core memory, but tainted by another imagery. " + 
                        (
                            this.props.matched_keywords.filter(wrd => wrd != "").length == 0 ? 
                            "No keywords matched in the prompt."
                            : "Matched keywords: " + this.getKeywordString(this.props.matched_keywords)
                        )
                        }</p>
                </div>

                } */}

                { // | noise | distance | unlocked & interpreted | unlocked & not yet interpreted 

                this.props.imgName == "noise"               ? <p style={{'marginTop': 0}}>The Machine returned a noise, the Sea does not know how to respond.</p>
                : !is_unlockable || !matched                ?
                        // Render the top five memories
                        <div className = "row">
                            <p   className = "column left" style={{'marginTop': 0}}> Memory Resonance: </p>
                            <div className = "column right">
                                {this.props.similarities.slice(0,5).map(
                                    (img:any, i:number) => {
                                        return(
                                            <div style={{'marginTop': 0, 'marginBottom': 0}} key={i}>
                                                {this.getDistanceString(i, img.name, img.score, is_unlockable)}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                : this.props.dialogueVar.get(imgName) > -1  ? <p style={{'marginTop': 0}}>{this.props.imgData[imgName]["interpretations"][this.props.dialogueVar.get(imgName)][1]}</p>
                :   // The buttons for interpretations
                    <div>
                    <p style={{'marginTop': 0}}>This core memory is unlocked. But what is this picture saying? </p>
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