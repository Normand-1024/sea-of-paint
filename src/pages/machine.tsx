import React, {createRef, useState} from 'react';

import '../App.css';

// @ts-ignore
import YarnBound from 'yarn-bound';
import ImageGenerator from '../components/imageGenerator.tsx';

import { MarkovScrambler } from '../functions/markovGeneration.tsx';

import {PAGE_STATE, SPIRIT_NAME, MID_INTEGR_THRSH, LOW_INTEGR_THRSH} from '../constants.tsx';

const DIALOGUE_TYPE = {'spirit': 0, 'self-speaking': 1, 'self-thinking': 2, 'machine': 3};
const GENERATE_WAIT_TYPE = {'dialogue': -1, 'wait_for_first': 0, 'generated': 1, 'wait_for_lily1': 2, 'wait_for_lily2': 22, 'wait_for_interpretations': 3};

type MachineProps = {
    pageState: number;
    setPageState: Function;
}

type MachineState = {
    machineActive: boolean;
    markovScrambler: MarkovScrambler;
    dialogueList: Array<[number, string]>;
    promptList: Array<string>;
    dialogueRunner: YarnBound;
    generateState: number;
    dialogueVar: Map<any, any>;
}

class MachinePage extends React.Component<MachineProps, MachineState> {
    state: MachineState = {
        machineActive: false,
        dialogueList: [],
        promptList: [],
        markovScrambler: new MarkovScrambler(),
        dialogueRunner: undefined,
        generateState: GENERATE_WAIT_TYPE['dialogue'],
        dialogueVar: new Map<any, any>()
    };

    private dialogueEndRef = createRef<HTMLDivElement>();
    private textPromptRef = createRef<HTMLInputElement>();

    componentDidMount() {

        // *********** Load the text into markov chain ***********

        this.state.markovScrambler.initialize("./assets/markovtext.txt");

        // *********** Load the yarn file into dialogueRunner ***********
        fetch("./texts/dialogue.yarn")
        .then((res) => res.text())
        .then((text) => {
            this.setState(() => ({
                dialogueRunner: new YarnBound({
                    dialogue: text,
                    variableStorage: this.state.dialogueVar
                })
            }));
        })
        .catch((e) => console.error(e));
    }

    componentDidUpdate(prevProps: MachineProps, prevState: MachineState): void {
        if (prevState.dialogueList.length != this.state.dialogueList.length) {
            this.dialogueEndRef.current?.scrollIntoView(false);
        }
    }

    setDialogueVar = (v : string, value : any) => {
        this.state.dialogueVar.set(v, value);

        // Check if there's any interpretations left open
        if (this.state.generateState == GENERATE_WAIT_TYPE['wait_for_lily2'] &&
            this.state.dialogueVar.get("lily") >= 0)
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['generated'] }));  
        // else if (this.state.generateState == GENERATE_WAIT_TYPE['wait_for_lily'])
        //     this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['generated'] }));

        this.forceUpdate();
    }

    pushSpiritDialogue = (line : string) => {
        
        // Check scrambling
        if (this.state.dialogueVar.get("integrity") < MID_INTEGR_THRSH || this.state.dialogueVar.get("scramble")){
            line = this.state.markovScrambler.markovScramble(this.state.dialogueRunner.currentResult.text);
            line = this.state.markovScrambler.markovScramble(line);
        }
        else if (this.state.dialogueVar.get("integrity") < LOW_INTEGR_THRSH)
            line = this.state.markovScrambler.generate();

        let new_entry : [number, string] = [DIALOGUE_TYPE['spirit'], line];
        this.setState((state) => ({
            dialogueList: [...state.dialogueList, new_entry]
        }));
    }

    pushSelfDialogue = (line: string, dialogueType: number) => {
        let new_entry : [number, string] = [dialogueType, line];
        this.setState((state) => ({
            dialogueList: [...state.dialogueList, new_entry]
        }));
    }

    activateMachine = () => {
        this.setState(() => ({
            machineActive: true
        }));

        //this.updatePromptList(); // generate a random image
        
        this.pushSpiritDialogue(this.state.dialogueRunner.currentResult.text);
        this.state.dialogueRunner.advance();
    }

    // Updating the prompt list also signals the image generator to start working
    updatePromptList = () => {
        let inprompt: string;

        if (this.textPromptRef.current) inprompt = this.textPromptRef.current.value;
        else inprompt = "SOMETHING WENT WRONG";

        if (inprompt == "") return;
        
        if (this.state.generateState == GENERATE_WAIT_TYPE['wait_for_first'])
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['generated'] }));

        this.setState((state) => ({
            promptList: [...state.promptList, inprompt]
        }));
    }

    handleDialogue = (option : number = -1) => {
        let original_integr = this.state.dialogueVar.get("integrity");
    
        //console.log(this.state.dialogueRunner.currentResult);
        //console.log(this.state.dialogueVar);
        //console.log(this.state.dialogueVar.get("scene_var"));

        // If #generate is true, get into image generation mode
        if (this.state.dialogueVar.get("generate")) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_first'] }));
            this.state.dialogueVar.set("generate", false)
        }
        else if (this.state.dialogueVar.get("generate_lily1")) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_lily1'] }));
            this.state.dialogueVar.set("generate_lily1", false)
        }
        else if (this.state.dialogueVar.get("generate_lily2")) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_lily2'] }));
            this.state.dialogueVar.set("generate_lily2", false)
        }
        else {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['dialogue'] }));
        }

        // Whether dialogueRunner.currentResult is option or text
        //  is handled in the HTML, communiated thru the option param
        // Except the machine prompt, which is not added to the dialogue
        if (option >= 0){
            if (this.state.dialogueVar.get("noprint")){
                // If $noprint is true, do not print this dialogue option.
                
                this.state.dialogueVar.set("noprint", false);
            } 
            else    
                this.pushSelfDialogue(
                    this.state.dialogueRunner.currentResult.options[option].text,
                    DIALOGUE_TYPE['self-speaking']
                );

            this.state.dialogueRunner.advance(option);
        }

        if (!("options" in this.state.dialogueRunner.currentResult)) {
            if (this.state.dialogueVar.get("self"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                DIALOGUE_TYPE['self-thinking']);

            else if (this.state.dialogueVar.get("selfspeak"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                DIALOGUE_TYPE['self-speaking']);

            else this.pushSpiritDialogue(this.state.dialogueRunner.currentResult.text);

            this.state.dialogueRunner.advance();
        }

        // If $follow is true, print the next statement
        while (this.state.dialogueVar.get("follow")) {
            console.log(this.state.dialogueVar.get("selfspeak"));
            if (this.state.dialogueVar.get("self"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                    DIALOGUE_TYPE['self-thinking']);

            else if (this.state.dialogueVar.get("selfspeak"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                    DIALOGUE_TYPE['self-speaking']);

            else this.pushSpiritDialogue(this.state.dialogueRunner.currentResult.text);

            this.state.dialogueRunner.advance();
        }

        // Handle announcement when thresholds are crossed
        if (original_integr > MID_INTEGR_THRSH &&
                this.state.dialogueVar.get("integrity") < MID_INTEGR_THRSH) {
            this.pushSelfDialogue(SPIRIT_NAME + " is overwhelmed by the Voices", 
                DIALOGUE_TYPE['self-thinking']);
        }
        else if (original_integr > LOW_INTEGR_THRSH &&
                this.state.dialogueVar.get("integrity") < LOW_INTEGR_THRSH) {
            this.pushSelfDialogue(SPIRIT_NAME + " is lost to the Sea", 
                DIALOGUE_TYPE['self-thinking']);
        }
    }

    render() {
        return (
            <div id="machinePage">

                <div id="machineDisplay">
                    <img id="nameCard"
                        src={!this.state.machineActive ? 
                                "./assets/images/namecard.png" 
                                : this.state.generateState == GENERATE_WAIT_TYPE['dialogue'] ?
                                    "./assets/images/mey_dialogue_1.png"
                                    : "./assets/images/mey_dialogue_2.png"
                            }
                        style={{position: this.state.machineActive ? "absolute" : "relative",
                                right: this.state.machineActive ? "82%" : "0",
                                height: this.state.machineActive ? "" : "40%"}}>
                    </img>

                    <div id="dialogueCol"
                        style={{height: this.state.machineActive ? "90%" : "60%"}}>
                    
                        <div id="dialogue">
                            {this.state.dialogueList.map((item,index) => {
                                if (item[0] == DIALOGUE_TYPE['spirit']) 
                                    return (<p key={index} className='spirit-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['self-speaking'])
                                    return (<p key={index} className='self-speaking-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['self-thinking'])
                                    return (<p key={index} className='self-thinking-line'>{item[1]}</p>);
                                else
                                    return (<p key={index} className='machine-line'>{item[1]}</p>);
                            })}
                        </div>

                        <div id="button-container">
                            {
                            !this.state.machineActive ?

                            <div className="button-div">
                            <button type="button" className="dialogue-button" 
                                onClick = {this.activateMachine}>
                                Activate Machine, bring back Mey</button></div> 
                                
                            :
                                
                            (   
                                "options" in this.state.dialogueRunner.currentResult &&  
                                this.state.generateState ==  GENERATE_WAIT_TYPE['dialogue']?

                                this.state.dialogueRunner.currentResult.options.map(
                                    (op:any,i:number) => {                      
                                        return (
                                            
                                            op.isAvailable ? 

                                            <div className="button-div" key={i}><button key={i} 
                                                type="button" className="dialogue-button"
                                                onClick = {() => this.handleDialogue(i)}>
                                                    {op.text}
                                            </button></div> : <div></div>

                                            // this.state.dialogueVar.get("machine") ?  
                                                
                                            //     <div className="button-div" key={i}><button key={i} 
                                            //         type="button" className="machine-button"
                                            //         onClick = {() => this.handleDialogue(i)}>
                                            //             {op.text}
                                            //     </button></div> :
                                            //     <div className="button-div" key={i}><button key={i} 
                                            //         type="button" className="dialogue-button"
                                            //         onClick = {() => this.handleDialogue(i)}>
                                            //             {op.text}
                                            //     </button></div>
                                        );
                                }) 
                                
                                :
                                
                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_first']?  
                                
                                    <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Generate one Image to Continue</button></div> 
                                        
                                    :

                                    this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_lily2']?
                                        
                                        <div className="button-div">
                                        <button type="button" className="continue-button" disabled>
                                            Unlock Memory of Lily to Continue</button></div>   

                                        :

                                        this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_lily1']?
                                        
                                        <div className="button-div">
                                        <button type="button" className="continue-button" disabled>
                                            Find a Core Memory</button></div>   

                                        :

                                            this.state.generateState ==  GENERATE_WAIT_TYPE['generated']?
                                                
                                                <div className="button-div">
                                                <button type="button" className="continue-button" 
                                                    onClick = {() => this.handleDialogue()}>
                                                    Bring back Mey</button></div>

                                                :

                                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_interpretations']?

                                                    <div className="button-div">
                                                    <button type="button" className="continue-button" disabled>
                                                        Finish Interpretations to Continue</button></div> 

                                                    :
                                                        
                                                    <div className="button-div">
                                                    <button type="button" className="continue-button" 
                                                        onClick = {() => this.handleDialogue()}>
                                                        Continue</button></div>
                            )
                            }
                        </div>

                        <div ref={this.dialogueEndRef}></div>
                    
                    </div>
                </div>

                <div id="machineControl">
                    <ImageGenerator prompts = {this.state.promptList}
                                    if_tutorial = {this.state.generateState == GENERATE_WAIT_TYPE['wait_for_lily1'] || this.state.generateState == GENERATE_WAIT_TYPE['wait_for_lily2']}
                                    dialogueVar = {this.state.dialogueVar}
                                    setDialogueVar  = {this.setDialogueVar}
                                    initiateScene = {this.handleDialogue} ></ImageGenerator>

                    { 
                    
                    this.state.machineActive ?

                    <div id="prompt-control">
                        <input type="text" id="prompt" autoComplete="off" ref={this.textPromptRef}></input>

                        {this.state.generateState  == GENERATE_WAIT_TYPE['dialogue'] ?
                        <button type="button" id="promptSubmit" disabled>Mey is away</button>
                        :
                        <button type="button" id="promptSubmit"
                             onClick = {() => this.updatePromptList()}>Generate</button>}
                    </div> 
                        
                    : 
                    
                    <div></div>

                    }
                </div>

            </div>
        );
    }
}

export default MachinePage;
