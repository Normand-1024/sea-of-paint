import React, {useEffect} from 'react';
import { Story } from 'inkjs';

import '../styles/candidate.css';

import { HIGH_BOUND, LOW_BOUND, GENERATE_WAIT_TYPE, LEANINIG_INTERVAL, UNLOCK_SCORE} from '../constants.tsx';
import { match } from 'assert';

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

    memorabilia: (string | number)[][]; // [id1, id2, interpt1, interpt2, imageURL] x 3
	setMemorabilia: Function;
}

type CandidateState = {
        imageurl: string,
        inMemora: number, // -1: not memorabilia, 0: currently building, 1: this is a memorabilium
        mem1_interp: number,
        mem2_interp: number
}

export class Candidate extends React.Component<CandidateProps, CandidateState> {
    state: CandidateState = {
        imageurl: "public/assets/images/placeholder.jpg",
        inMemora: -1,
        mem1_interp: -1,
        mem2_interp: -1
    }

    getMemInfo(  image_name : string,
                 image_score : number,
                 if_main : boolean,
                 if_retrieved : boolean,
                 if_tutorial : boolean,
                 if_used : boolean,
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
        
        return <div>
            <div className={'score-display'}>{score}</div> 
            {this.displayMeminfo(memName, if_main, if_retrieved, if_used)} 
        </div>;
    }

    displayMeminfo(memName : string, if_main : boolean, if_retrieved : boolean, if_used : boolean){
        if (if_used)
            return <div onClick = {() => this.fillPromptBox(memName)} className="meminfo-button meminfo-button-used">{memName}</div> 
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

        return <div className = "copiable-prompt" onClick = {() => this.fillPromptBox(output)}>"{output}"</div>
    }

    initiateMemoryScene(if_main : boolean) {
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

    markMemoraBuilding() {
        this.setState({"inMemora": 0});
    }

    writeMemoraStatement(which_image : number, which_statement : number) {
        if (which_image == 0) this.setState({mem1_interp: which_statement});
        else this.setState({mem2_interp: which_statement});
    }

    confirmMemora() {
        let tempMemData = [this.props.similarities[0].name, this.props.similarities[1].name,
                            this.state.mem1_interp, this.state.mem2_interp, this.props.imageurl]
        // console.log(tempMemData);

        this.props.setMemorabilia(
            this.props.memorabilia.map((mem, index) => {
                if (index == this.props.dialogueRunner.variablesState["memorabilia"]){
                    return tempMemData.slice(1);
                }
                else {
                    return mem;
                }
            }
        ));

        let memoraCount = this.props.dialogueRunner.variablesState["memorabilia"];

        this.props.setDialogueVar("memorabilia", memoraCount + 1);
        this.props.setDialogueVar("mem" + (memoraCount + 1).toString() + "_line", 
                                   this.props.imgData[tempMemData[0]]["memorabilia"][tempMemData[2]] + ", and she" +
                                    this.props.imgData[tempMemData[1]]["memorabilia"][tempMemData[3]].slice(3) );
        this.props.setDialogueVar("mem" + (memoraCount + 1).toString() + "_m1", tempMemData[0]);
        this.props.setDialogueVar("mem" + (memoraCount + 1).toString() + "_m2", tempMemData[1]);
        this.props.setDialogueVar("mem" + (memoraCount + 1).toString() + "_i1", tempMemData[2]);
        this.props.setDialogueVar("mem" + (memoraCount + 1).toString() + "_i2", tempMemData[3]);
        this.props.setDialogueVar(tempMemData[0] + "_m", true);
        this.props.setDialogueVar(tempMemData[1] + "_m", true);
        this.props.setDialogueVar("current_stage", 5);
        this.setState({inMemora: 1});
    }

    resetMemora() {
        this.setState({inMemora: -1, mem1_interp: -1, mem2_interp: -1});
    }

    fillPromptBox(text : string) {
        this.props.fillPromptBox(text);
    }

    seaDoesNotKnow() {
        var output = "The Machine returned a noise, the Sea does not know how to respond.";

        if (this.props.inprompt[this.props.inprompt.length - 1] == "?") 
            output += "The Sea technically does not answer questions. It surfaces memories that resonate with the prompt."
            
        return <div className="row-wrapper"><div className="interpret-line"><p>{output}</p></div></div>
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

    getTopDistanceString(i : number, imgName : string, score : number) {

        // Check if the image is yet to be unlocked
        let if_retrieved : boolean = this.props.dialogueRunner.variablesState[imgName] >= 0; 
        let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.props.imgData[imgName]["scene"]);
        let if_visited : boolean = false;
        let if_tutorial : boolean = this.props.dialogueRunner.state.VisitCountAtPathString("A2_Generation") == 0;
        let if_main : boolean = this.props.imgData[imgName]["interpretations"].length > 0;
        let if_used : boolean = this.props.dialogueRunner.variablesState[imgName + "_m"];

        if (visit_count == null || visit_count == undefined)
            console.log("WARNING: VISIT_COUNT IS NULL OR UNDEFINED");
        else if_visited = visit_count > 0;

        if (i > 0 && score < LOW_BOUND) 
            return (null);
        
        if (i > 0) 
            return (<div className="mem-entry">{this.getMemInfo(imgName, score, if_main, if_retrieved, if_tutorial, if_used, i)}</div>);

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

        let memoryType = if_retrieved ? "Retrieved" : if_main ? "Core Memory" : "Non-core Memory";
        let XWordsMissing = this.props.imgData[imgName]["keywords"].length.toString() + " Words Missing";
        let NXWordsFound = this.props.wordStat.filter(x => x).length.toString() + 
                            "/" + this.props.imgData[imgName]["keywords"].length.toString() +
                            " Words Found";

        let secondString = 
            if_retrieved ? "Retrieved"
                : !if_visited ? XWordsMissing + " - Inquiry Needed"
                    : NXWordsFound;

        return (<div className="mem-entry top-display">
            {this.getMemInfo(imgName, score, if_main, if_retrieved, if_tutorial, if_used, i)}

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
                        onClick = {() => this.initiateMemoryScene(if_main)}>
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

    getBottomDistanceString(i : number, imgName : string, score : number) {

        // Check if the image is yet to be unlocked
        let if_retrieved : boolean = this.props.dialogueRunner.variablesState[imgName] >= 0; 
        let visit_count = this.props.dialogueRunner.state.VisitCountAtPathString(this.props.imgData[imgName]["scene"]);
        let if_visited : boolean = false;
        let if_tutorial : boolean = this.props.dialogueRunner.state.VisitCountAtPathString("A2_Generation") == 0;
        let if_main : boolean = this.props.imgData[imgName]["interpretations"].length > 0;
        let if_used : boolean = this.props.dialogueRunner.variablesState[imgName + "_m"];

        if (visit_count == null || visit_count == undefined)
            console.log("WARNING: VISIT_COUNT IS NULL OR UNDEFINED");
        else if_visited = visit_count > 0;

        if (i == 1 && score > LOW_BOUND) return (null);
        
        return (<div className="mem-entry">{this.getMemInfo(imgName, score, if_main, if_retrieved, if_tutorial, if_used, i)}</div>);
    }

    render() {

        // check if paths to unlocked the image has been traversed
        let imgName = this.props.imgName;
        let matched = this.props.similarities[0].score == UNLOCK_SCORE;
        let if_top_main : boolean = imgName != "noise" && this.props.imgData[imgName]["interpretations"].length > 0;
        let if_two_used = 
            this.props.similarities[0].name != "noise" && this.props.similarities[1].name != "noise"
            && this.props.dialogueRunner.variablesState[this.props.similarities[0].name + "_m"]
            || this.props.dialogueRunner.variablesState[this.props.similarities[1].name + "_m"];

        return (
            <div className = "candidate">
                <div className="image-wrapper">
                    <img
                        src={this.props.imageurl}
                        className="image"
                    />
                    <p className="image-caption">
                        "{this.props.inprompt}"
                    </p>
                </div>
                { /* | noise | distance | unlocked & interpreted | unlocked & not yet interpreted */ 

                imgName == "noise" ? this.seaDoesNotKnow()
                : this.state["inMemora"] == 0 ? 
                    <div className = "row-wrapper">
                        <p className = "copiable-prompt-reveal">
                            This image is composed of {this.props.imgData[this.props.similarities[0].name]["memora_descrip"]},
                             and then {this.props.imgData[this.props.similarities[1].name]["memora_descrip"]}.
                             {  this.props.dialogueRunner.variablesState[this.props.similarities[0].name] < 0
                                || this.props.dialogueRunner.variablesState[this.props.similarities[1].name] < 0 ?
                                " I'm using unretrieved memories. It's a risk, because I don't know what they are about yet." : ""
                             }
                        </p>

                        {
                        this.state.mem1_interp < 0 ?
                            <>
                                <p className = "interpret-line" style={{'marginTop': 0}}>What statement should I write for it?</p>
                                {
                                    this.props.imgData[this.props.similarities[0].name]["memorabilia"].map(
                                        (op:any,i:number) => {                      
                                            return (
                                                <div key={i}
                                                    className="interpret-button"
                                                    style={{'color':'#8f7f40'}}
                                                    onClick = {() => this.writeMemoraStatement(0, i)}>
                                                    {op}...
                                                </div>
                                            );
                                    }) 
                                }
                            </>
                        : this.state.mem2_interp < 0 ?
                            <>
                                <p className = "interpret-line-gold" style={{'marginTop': 0}}>
                                    "{this.props.imgData[this.props.similarities[0].name]["memorabilia"][this.state.mem1_interp]}...
                                </p>

                                {
                                    this.props.imgData[this.props.similarities[1].name]["memorabilia"].map(
                                        (op:any,i:number) => {                      
                                            return (
                                                <div key={i}
                                                    className="interpret-button"
                                                    style={{'color':'#8f7f40'}}
                                                    onClick = {() => this.writeMemoraStatement(1, i)}>
                                                    ...and she {op.slice(3)}
                                                </div>
                                            );
                                    }) 
                                }
                            </>
                        :
                            <>
                                <p className = "interpret-line-gold" style={{'marginTop': 0}}>
                                    "{this.props.imgData[this.props.similarities[0].name]["memorabilia"][this.state.mem1_interp] + ", and she" +
                                    this.props.imgData[this.props.similarities[1].name]["memorabilia"][this.state.mem2_interp].slice(3)}"
                                </p>

                                <p className = "copiable-prompt-reveal" style={{'marginTop': 0}}>
                                    Save this memorabilum from the Machine? </p>

                                <div className="interpret-button"
                                    onClick = {() => this.confirmMemora()}>
                                    Confirm Memorabilium
                                </div>
                                <div className="interpret-button"
                                    onClick = {() => this.resetMemora()}>
                                    Discard Design and Return to Machine Interface
                                </div>
                            </>
                        }
                    </div>
                : this.state["inMemora"] == 1 ? 
                    <div className = "row-wrapper">
                        <p className = "interpret-line-gold" style={{'marginTop': 0}}>
                            "{this.props.imgData[this.props.similarities[0].name]["memorabilia"][this.state.mem1_interp] + ", and she" +
                                    this.props.imgData[this.props.similarities[1].name]["memorabilia"][this.state.mem2_interp].slice(3)}"
                        </p>

                        <p className = "copiable-prompt-reveal" style={{'marginTop': 0}}>
                                    {this.props.dialogueRunner.variablesState["memorabilia"] == 1 ? 
                                        "One memorabilium created. I can still create two more, or I could end the session."
                                    : this.props.dialogueRunner.variablesState["memorabilia"] == 2 ?
                                        "Two memorabilia created. I can still create one more."
                                    :   "Finished last memorabilium. I should wrap up and end the session."}
                        </p>
                    </div>
                : !matched ?
                        // Render the top five memories
                        <div className = "row-wrapper">
                            <div className = {"top-two" + " " +
                                    (this.props.dialogueRunner.variablesState["current_stage"] < 4 
                                    || this.props.dialogueRunner.variablesState["memorabilia"] >= 3 ? ""
                                    : !if_two_used ? "top-two-clickable" : "top-two-locked")}>
                                
                                {this.props.dialogueRunner.variablesState["current_stage"] < 4 
                                    || this.props.dialogueRunner.variablesState["memorabilia"] >= 3 ? (null)
                                // : this.props.dialogueRunner.variablesState["memorabilia"] >= 3 ?
                                //     <div className="memora-button memora-button-locked"> Memorabilia Count Full </div>
                                : !if_two_used ?
                                    (this.props.dialogueRunner.variablesState["scene_var"] == "A2_Memorabilia" ? 
                                    <div className= "memora-button memora-button-clickable-disabled " > Memorabilium Building in Progress </div>
                                    :this.props.generateState == GENERATE_WAIT_TYPE['dialogue'] ? 
                                    <div className= "memora-button memora-button-clickable-disabled " > Submerge Mey to Make this Memorabilium </div>
                                    :<div className= "memora-button memora-button-clickable" onClick = {() => this.markMemoraBuilding()}> Make Memorabilium </div>)
                                :   <div className="memora-button memora-button-locked"> One or More Memories already Used </div>}

                                {this.props.similarities.slice(0,2).map(
                                    (img:any, i:number) => {
                                        return(
                                            <div style={{'marginTop': 0, 'marginBottom': 0}} key={i}>
                                                {this.getTopDistanceString(i, img.name, img.score)}
                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            <p className='threshold-line'>Resonance Threshold</p>

                            <div className = "rest">
                                {this.props.similarities.slice(1,5).map(
                                        (img:any, i:number) => {
                                            return(
                                                <div style={{'marginTop': 0, 'marginBottom': 0}} key={i+1}>
                                                    {this.getBottomDistanceString(i+1, img.name, img.score)}
                                                </div>
                                            );
                                        }
                                )}
                            </div>
                        </div>
                : this.props.dialogueRunner.variablesState[imgName] > -1  ? 
                    <div className = "row-wrapper">
                        <p className = "copiable-prompt-reveal">"{this.props.imgData[imgName]["descp"]}"</p>
                        <p className = "interpret-line">
                            {if_top_main ? 
                            this.props.imgData[imgName]["interpretations"][this.props.dialogueRunner.variablesState[imgName]][1]
                            : this.props.imgData[imgName]["info"]}

                            {!if_top_main ? (null) : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 1 && 
                                    this.props.dialogueRunner.currentTags && this.props.dialogueRunner.currentTags.indexOf('generate_lily2') > -1 ? 
                                <p className = "interpret-line"> ...I can wake up Mey now.</p> : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 2 ?
                                <p className = "interpret-line"> ...One more to go. I should wake up Mey from another core memory.</p> : 
                            this.props.dialogueRunner.variablesState["core_unlocked"] == 3 && this.props.dialogueRunner.variablesState["current_stage"] == 3 ?
                                <p className = "interpret-line"> ...Time to move on to the next step. Mey is woken up now.</p> : (null)}
                        </p>
                    </div>
                :   // The buttons for interpretations
                    <div className = "row-wrapper">
                        <p className = "copiable-prompt-reveal">"{this.props.imgData[imgName]["descp"]}"</p>
                        <p className = "interpret-line" style={{'marginTop': 0}}>Core memory retrieved. But what is this picture saying? </p>
                        {   
                            this.props.imgData[imgName]["interpretations"].map(
                                (op:any,i:number) => {                      
                                    return (
                                        <div key={i}
                                            className="interpret-button"
                                            onClick = {() => this.interpretMemory(imgName, i)}>
                                            {op[0]}
                                        </div>
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