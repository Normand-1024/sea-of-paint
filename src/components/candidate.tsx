import React, {useEffect} from 'react';
import '../App.css'

import {IMAGE_DIM, HIGH_BOUND, LOW_BOUND} from '../constants.tsx';
import { match } from 'assert';

type CandidateProps = {
    inprompt: string;
	if_tutorial: boolean;
    similarities: Array<any>;
    wordStat: Array<boolean>;
    imgName: string;
    imageurl: string;
    imgData: { [id: string] : any; };
    
    dialogueVar: Map<any, any>;
    setDialogueVar: Function;
    initiateScene: Function;
}

type CandidateState = {
}

export class Candidate extends React.Component<CandidateProps, CandidateState> {
    state: CandidateState = {
        imageurl: "public/assets/images/placeholder.jpg"
    }

    private aboveHigh = this.props.similarities[0].score > HIGH_BOUND;

    getMemInfo(image_name : string, image_score : number, if_locked : boolean, i : number) {
        let memName : string = this.props.imgData[image_name].memory_name;
        let score : string = image_score < LOW_BOUND ? "Too Dissonant" : this.distanceFunc(image_score);

        if (i > 1 || image_score < LOW_BOUND){
            return (<div>
                <p>{score} --- {if_locked ? <u>&lt;&lt;{memName}&gt;&gt;</u> : <>[{memName}]</>} </p>
            </div>)
        }

        return <div>
            <p><b>{score} --- {if_locked ? <u>&lt;&lt;{memName}&gt;&gt;</u> : <>[{memName}]</>} </b></p>
        </div>;
    }
    
    getPrompt() {
        let prompt_array = this.props.imgData[this.props.imgName]["descp2"];
        let keywords = this.props.imgData[this.props.imgName]["keywords"];
        let output = prompt_array[0];

        // If the word has been matched before, print the word, otherwise print [?]
        for (let i = 0; i < this.props.wordStat.length; i++){
            if (this.props.wordStat[i]) 
                output = output.concat(" [" + keywords[i][0] + "] " + prompt_array[i + 1]);
            else 
                output = output.concat(" [?] " + prompt_array[i + 1]);
            console.log(i)
        }

        return <p className = "notif">"{output}"</p>
    }

    initiateScene() {
        this.props.setDialogueVar("scene_var", this.props.imgData[this.props.imgName]["scene"]);
        this.props.setDialogueVar(this.props.imgData[this.props.imgName]["path"], true);
        console.log(this.props.dialogueVar.get("scene_var"));
        this.props.initiateScene();
    }


    getDistanceString(i : number, imgName : string, score : number, is_unlockable : boolean) {

        // Check if the image is yet to be unlocked
        let if_locked : boolean = 
            this.props.imgData[imgName]["interpretations"].length > 0
            && this.props.dialogueVar.get(imgName) == -2; 

        if (i > 0) {
            return (<div>{this.getMemInfo(imgName, score, if_locked, i)}</div>);
        }
        else{

            // Check if the scene for that image has been visited
            
            // TODO: descp IS PLACEHOLDER
            if (this.props.dialogueVar.get(this.props.imgData[imgName]["path"])) {
                // has visited
                return (<div>
                    {this.getMemInfo(imgName, score, if_locked, i)}

                    { if_locked ? 
                        <p className = "notif"> Core Memory - Not Yet Retrieved </p>
                        : <p className = "notif"> Core Memory - Retrieved </p>
                    }

                    {this.getPrompt()}
                </div>);
                // TODO: SAY HOW MANY KEYWORDS REVEALED
                //      <p className = "notif"> 0/4 Missing Words Found </p>

            }
            else {
                // has not visited
                //      TODO: <p className = "notif"> 4 Words Missing - Inquiry Needed  </p>

                if (this.props.if_tutorial){
                    return (<div>
                                {this.getMemInfo(imgName, score, if_locked, i)}

                                { this.props.imgName == "lily" ? 
                                    <p className = "notif"> Core Memory - 4 Words Missing - Inquiry Needed  </p>
                                    : <p className = "notif"> Non-core Memory </p>}

                                {this.getPrompt()}
                                
                                { this.props.imgName == "lily" ? 
                                    <button key={i} type="button"
                                    style={{'marginLeft': '5%'}}
                                    onClick = {() => this.initiateScene()}>
                                    Bring back Mey, Inquire about Memory
                                    </button> 
                                    : (null)
                                }
                            </div>)
                }
                else
                    return (<div>
                                {this.getMemInfo(imgName, score, if_locked, i)}
                                {this.getPrompt()}
                                <button key={i} type="button"
                                style={{'marginLeft': '5%'}}
                                onClick = {() => this.initiateScene()}>
                                Bring back Mey, Inquire about Memory
                                </button> 
                            </div>);
            }

            // if (!is_unlockable) 
            //     return (this.getMemInfo(imgName, score, if_locked, i));
            // else if (score < HIGH_BOUND) 
            //     return (<div>
            //                 {this.getMemInfo(imgName, score, if_locked, i)}
            //                 <p className = "notif">Refine description to reach {this.distanceFunc(HIGH_BOUND)}</p>
            //             </div>);
            // else if (this.props.matched_keywords.filter(wrd => wrd != "").length == 0) 
            //     return (<div>
            //                 {this.getMemInfo(imgName, score, if_locked, i)}
            //                 <p className = "notif">Core memory tainted. No keywords found</p>
            //             </div>);
            // else 
            //     return (<div>
            //                 {this.getMemInfo(imgName, score, if_locked, i)}
            //                 <p className = "notif">Matched keywords: {this.getKeywordString()}</p>
            //             </div>);

        }
    }

    distanceFunc(score : number) {
        return (Math.round((score) * 10000) / 100).toString() + "%";
    }

    render() {

        // check if paths to unlocked the image has been traversed
        let imgName = this.props.imgName;
        let is_unlockable = imgName == "noise" ? false : this.props.imgData[imgName]["interpretations"].length > 0;
        let matched = this.aboveHigh;

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
                            <p   className = "column left" style={{'marginTop': 0}}> 
                                <big>Memory Resonance:</big> 


                                { this.props.dialogueVar.get("p_lily_q") ? 
                                 <><br></br><br></br><small>Reach {this.distanceFunc(HIGH_BOUND)} to Retrieve Memory</small></>
                                : (null)}
                            </p>

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
                : this.props.dialogueVar.get(imgName) > -1  ? 
                    <div>
                    <p className = "notif">Core Memory - "{this.props.imgData[imgName]["descp"]}"</p>
                    <p style={{'marginTop': 0}}>{this.props.imgData[imgName]["interpretations"][this.props.dialogueVar.get(imgName)][1]}</p>
                    </div>
                :   // The buttons for interpretations
                    <div>
                    <p className = "notif">Core Memory Retrieved - "{this.props.imgData[imgName]["descp"]}"</p>
                    <p style={{'marginTop': 0}}>Core memory retrieved. But what is this picture saying? </p>
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