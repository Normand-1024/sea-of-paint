import React, {useEffect} from 'react';
import '../App.css'
import { Story } from 'inkjs';

import {IMAGE_DIM, HIGH_BOUND, LOW_BOUND} from '../constants.tsx';
import { match } from 'assert';

const GENERATE_WAIT_TYPE = {'dialogue': -1, 'wait_for_first': 0, 'generated': 1, 'wait_for_lily1': 2, 'wait_for_lily2': 22, 'wait_for_interpretations': 3};

type CandidateProps = {
    inprompt: string;
    similarities: Array<any>;
    wordStat: Array<boolean>;
    imgName: string;
    imageurl: string;
    imgData: { [id: string] : any; };
    imgButton: { [id: string] : Boolean;};
    generateState: number;
    
    dialogueRunner: Story;
    setDialogueVar: Function;
    initiateScene: Function;
    fillPromptBox: Function;
}

type CandidateState = {
}

export class Candidate extends React.Component<CandidateProps, CandidateState> {
    state: CandidateState = {
        imageurl: "public/assets/images/placeholder.jpg"
    }

    private aboveHigh = this.props.similarities[0].score > HIGH_BOUND;

    getMemInfo(  image_name : string,
                 image_score : number,
                 if_main : boolean,
                 if_retrieved : boolean,
                 if_tutorial : boolean,
                 i : number) {
        let memName : string = this.props.imgData[image_name].memory_name;
        let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.props.imgData[image_name]["scene"]);
        let if_display_percentage = i < 2 && image_score > LOW_BOUND && 
                (!if_tutorial
                //|| this.props.dialogueRunner.state.VisitCountAtPathString("A2_Start")
                || this.props.dialogueRunner.variablesState["current_stage"] > 1 );
        let if_show_inquiry_needed = !if_retrieved && i == 0 && visit_count == 0 && 
                !(if_tutorial && !if_main) // non core memory during tutorial

        let score : string = if_show_inquiry_needed ? "Inquiry Needed" :
            if_display_percentage ? this.distanceFunc(image_score) : this.rankString(i);
        

        if (i > 1 || image_score < LOW_BOUND){
            return (<div>
                {i == 1 ? <p className='threshold-line'>————— Resonance Threshold —————</p> : null } 
                <div className='score-display'>{score}</div> 
                {this.displayMeminfo(memName, if_main, if_retrieved)} 
            </div>)
        }

        return <div>
            <div className='score-display'>{score}</div> 
            {this.displayMeminfo(memName, if_main, if_retrieved)} 
            {i == 1 ? <p className='threshold-line'>————— Resonance Threshold —————</p> : null } 
        </div>;
    }

    displayMeminfo(memName : string, if_main : boolean, if_retrieved : boolean){
        if (if_retrieved)
            return <div onClick = {() => this.fillPromptBox(memName)} className="meminfo-button meminfo-button-retrieved">{memName}</div> 
        if (if_main)
            return <div onClick = {() => this.fillPromptBox(memName)} className="meminfo-button meminfo-button-main">{memName}</div> 

        return <div onClick = {() => this.fillPromptBox(memName)} className="meminfo-button  meminfo-button-nonmain">{memName}</div>
    }

    distanceFunc(score : number) {
        return (Math.round((score) * 10000) / 100).toString() + "%";
    }

    rankString(rank : number) {
        if (rank == 0) return "1st";
        else if (rank == 1) return "2nd";
        else if (rank == 2) return "3rd";
        else if (rank == 3) return "4th";
        else if (rank == 4) return "5th";
        else return "rankUnknown";
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
        }

        return <p className = "copiable-prompt" onClick = {() => this.fillPromptBox(output)}>"{output}"</p>
    }

    handleButton(if_main : boolean) {
        this.props.imgButton[this.props.imgName] = true;

        if (if_main){
            console.log(this.props.imgData[this.props.imgName]);
            this.props.setDialogueVar("scene_var", this.props.imgData[this.props.imgName]["scene"]);
            console.log(this.props.dialogueRunner.variablesState["scene_var"]);
            this.props.initiateScene();

        }
        else {
            this.props.setDialogueVar(this.props.imgData[this.props.imgName]["d_var"], "true");
        }
    }

    fillPromptBox(text : string) {
        this.props.fillPromptBox(text);
    }

    seaDoesNotKnow() {
        var output = "The Machine returned a noise, the Sea does not know how to respond.";

        if (this.props.inprompt[this.props.inprompt.length - 1] == "?") 
            output += "The Sea technically does not answer questions. It surfaces memories that resonate with the prompt."
            
        return <p style={{'marginTop': 0}}>{output}</p>
    }

    interpretMemory(imgName : string, i : number) {
        this.props.setDialogueVar(imgName, i);
        this.props.setDialogueVar("core_unlocked", this.props.dialogueRunner.variablesState["core_unlocked"] + 1);

        if (this.props.dialogueRunner.variablesState["core_unlocked"] == 3 
                && this.props.dialogueRunner.state.VisitCountAtPathString("A2_Next_Step") == 0) {
                    
            this.props.setDialogueVar("scene_var", "A2_Next_Step");
            this.props.initiateScene();

        }
            
    }

    getDistanceString(i : number, imgName : string, score : number) {

        // Check if the image is yet to be unlocked
        let if_retrieved : boolean = this.props.dialogueRunner.variablesState[imgName] >= 0; 
        let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.props.imgData[imgName]["scene"]);
        let if_visited : boolean = false;
        let if_tutorial : boolean = this.props.dialogueRunner.state.VisitCountAtPathString("A2_Generation") == 0;
        let if_main : boolean = this.props.imgData[imgName]["interpretations"].length > 0;

        if (visit_count == null || visit_count == undefined)
            console.log("WARNING: VISIT_COUNT IS NULL OR UNDEFINED");
        else if_visited = visit_count > 0;

        if (i > 0) {
            return (<div className="mem-entry">{this.getMemInfo(imgName, score, if_main, if_retrieved, if_tutorial, i)}</div>);
        } 
        else{
            // Only the top match displays more information

            //  Core Memory - X Words Missing - Inquiry Needed
            //  Core Memory - N/X Words Found
            //  Core Memory - Retrieved
            //  Non-core Memory - N/X Words Found
            //  Non-core Memory - Retrieved

            // If in tutorial:
                //  Core Memory - X Words Missing - Inquiry Needed
                //  Core Memory - N/X Words Found
                //  Core Memory - Retrieved
                //  Non-core Memory

            let memoryType = if_main ? "Core Memory" : "Non-core Memory";
            let XWordsMissing = this.props.imgData[imgName]["keywords"].length.toString() + " Words Missing";
            let NXWordsFound = this.props.wordStat.filter(x => x).length.toString() + 
                                "/" + this.props.imgData[imgName]["keywords"].length.toString() +
                                " Words Found";

            let secondString = 
                if_retrieved ? "Retrieved"
                    : !if_visited ? XWordsMissing + " - Inquiry Needed"
                        : NXWordsFound;

            return (<div className="mem-entry top-display">
                {this.getMemInfo(imgName, score, if_main, if_retrieved, if_tutorial, i)}

                <div className="top-main-info">
                    <p className = "notif"> {memoryType} </p>
                    {/* {if_tutorial && !if_main ? 
                        (null)
                        : <p className = "notif"> {secondString} </p>
                    } */}

                    {if_tutorial && !if_main ? (null) : 
                    <div className="prompt-box">
                        {this.getPrompt()}
                        
                        {this.props.imgButton[imgName] || if_retrieved ||
                        (if_tutorial && !if_main) || this.props.generateState == GENERATE_WAIT_TYPE['dialogue'] ?
                            (null)

                            : 
                            
                            <div key={i} className="interact-button"
                            onClick = {() => this.handleButton(if_main)}>
                                { if_main ?
                                "Bring back Mey, Inquire about Memory"
                                : "Note this Memory for Conversation Later"
                                }
                            </div>   
                        }
                    </div>}
                </div>
            </div>);
        }

    }

    render() {

        // check if paths to unlocked the image has been traversed
        let imgName = this.props.imgName;
        let matched = this.aboveHigh;
        let if_top_main : boolean = imgName != "noise" && this.props.imgData[imgName]["interpretations"].length > 0;

        return (
            <div className = "candidate">

                <img src={this.props.imageurl} style={{'width': '100%'}}></img>
                <p style={{'marginTop': 0, 'color': 'gray', 'fontStyle': 'italic'}}>"{this.props.inprompt}"</p>

                { // | noise | distance | unlocked & interpreted | unlocked & not yet interpreted 

                imgName == "noise" ? this.seaDoesNotKnow()
                : !matched ?
                        // Render the top five memories
                        <div className = "row">
                            <p   className = "column left" style={{'marginTop': 0}}> 
                                <big>Memories sorted by Resonance:</big> 


                                { this.props.dialogueRunner.variablesState["current_stage"] > 1 ? 
                                 <><br></br><br></br><small><center>Reach {this.distanceFunc(HIGH_BOUND)} to Retrieve Memory</center></small></>
                                : (null)}
                            </p>

                            <div className = "column right">
                                {this.props.similarities.slice(0,5).map(
                                    (img:any, i:number) => {
                                        return(
                                            <div style={{'marginTop': 0, 'marginBottom': 0}} key={i}>
                                                {this.getDistanceString(i, img.name, img.score)}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                : this.props.dialogueRunner.variablesState[imgName] > -1  ? 
                    <div>
                        <p className = "copiable-prompt-reveal">"{this.props.imgData[imgName]["descp"]}"</p>
                        <p className = "interpret-line">
                            {if_top_main ? 
                            this.props.imgData[imgName]["interpretations"][this.props.dialogueRunner.variablesState[imgName]][1]
                            : this.props.imgData[imgName]["info"]} 
                            
                            ...

                            {!if_top_main ? (null) : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 1 ? 
                                <p className = "interpret-line"> I can wake up Mey now.</p> : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 2 ?
                                <p className = "interpret-line"> One more to go. I should wake up Mey from another core memory.</p> : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 3 && this.props.dialogueRunner.variablesState["current_stage"] == 3 ?
                                <p className = "interpret-line"> Time to move on to the next step. Mey is woken up now.</p> : (null)}
                        </p>
                    </div>
                :   // The buttons for interpretations
                    <div>
                    <p className = "copiable-prompt-reveal">"{this.props.imgData[imgName]["descp"]}"</p>
                    <p style={{'marginTop': 0}}>Core memory retrieved. But what is this picture saying? </p>
                    {   
                        this.props.imgData[imgName]["interpretations"].map(
                            (op:any,i:number) => {                      
                                return (
                                    <div key={i}><div key={i}
                                        className="interpret-button"
                                        onClick = {() => this.interpretMemory(imgName, i)}>
                                        {op[0]}
                                    </div></div>
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