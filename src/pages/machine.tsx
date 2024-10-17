import React, {createRef} from 'react';

import '../App.css';

// @ts-ignore
import YarnBound from 'yarn-bound';
import ImageGenerator from '../components/imageGenerator.tsx';

import { MarkovScrambler } from '../functions/markovGeneration.tsx';

import {PAGE_STATE, SPIRIT_NAME, MID_INTEGR_THRSH, LOW_INTEGR_THRSH} from '../constants.tsx';

const DIALOGUE_TYPE = {'spirit': 0, 'self-speaking': 1, 'self-thinking': 2, 'machine': 3};
const GENERATE_WAIT_TYPE = {'dialogue': -1, 'wait_for_first': 0, 'generated': 1};

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
    dialogueVar: Map<any, any>;
    waitingToGenerate: number;
}

class MachinePage extends React.Component<MachineProps, MachineState> {
    state: MachineState = {
        machineActive: false,
        dialogueList: [],
        promptList: [],
        markovScrambler: new MarkovScrambler(),
        dialogueRunner: undefined,
        dialogueVar: new Map<any, any>(),
        waitingToGenerate: GENERATE_WAIT_TYPE['dialogue']
    };

    private dialogueEndRef = createRef<HTMLDivElement>();
    private textPromptRef = createRef<HTMLInputElement>();

    componentDidMount() {

        // *********** Load the text into markov chain ***********

        this.state.markovScrambler.initialize("public/assets/markovtext.txt");

        // *********** Load the yarn file into dialogueRunner ***********
        fetch("public/texts/dialogue.yarn")
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

    pushSpiritDialogue = (line : string) => {
        
        // Handle losing integrity
        if (this.state.dialogueVar.get("integrity") < MID_INTEGR_THRSH)
            line = this.state.markovScrambler.markovScramble(this.state.dialogueRunner.currentResult.text);
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

        this.updatePromptList(); // generate a random image
        
        this.pushSpiritDialogue(this.state.dialogueRunner.currentResult.text);
        this.state.dialogueRunner.advance();
    }

    // Updating the prompt list also signals the image generator to start working
    updatePromptList = () => {
        let inprompt: string;

        if (this.textPromptRef.current) inprompt = this.textPromptRef.current.value;
        else inprompt = "SOMETHING WENT WRONG";
        
        this.setState(() => ({ waitingToGenerate: GENERATE_WAIT_TYPE['generated'] }));

        this.setState((state) => ({
            promptList: [...state.promptList, inprompt]
        }));
    }

    handleDialogue = (option : number = -1) => {
        let original_integr = this.state.dialogueVar.get("integrity");
    
        //console.log(this.state.dialogueRunner.currentResult);
        //console.log(this.state.dialogueVar);

        // If #generate is true, get into image generation mode
        if (this.state.dialogueVar.get("generate")) {
            this.setState(() => ({ waitingToGenerate: GENERATE_WAIT_TYPE['wait_for_first'] }));
        }
        else {
            this.setState(() => ({ waitingToGenerate: GENERATE_WAIT_TYPE['dialogue'] }));
        }

        // Whether dialogueRunner.currentResult is option or text
        //  is handled in the HTML, communiated thru the option param
        // Except the machine prompt, which is not added to the dialogue
        if (option >= 0){
            if (!this.state.dialogueVar.get("machine"))
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

            else if (this.state.dialogueVar.get("machine"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                DIALOGUE_TYPE['machine']);

            else this.pushSpiritDialogue(this.state.dialogueRunner.currentResult.text);

            this.state.dialogueRunner.advance();
        }

        // If $follow is true, print the next statement
        while (this.state.dialogueVar.get("follow")) {
            if (this.state.dialogueVar.get("self"))
                this.pushSelfDialogue(this.state.dialogueRunner.currentResult.text,
                    DIALOGUE_TYPE['self-thinking']);
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
                    <img src="public/assets/images/namecard.png" id="nameCard"></img>

                    <div id="dialogueCol">
                    
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
                                Activate Machine, Bring Back Mey</button></div> :
                                
                            (   
                                "options" in this.state.dialogueRunner.currentResult ?

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
                                }) :

                                
                                this.state.waitingToGenerate ==  GENERATE_WAIT_TYPE['wait_for_first']?  
                                
                                    <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Generate one Image to Continue</button></div> :

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
                    <ImageGenerator prompts = {this.state.promptList}></ImageGenerator>

                    { 
                    
                    this.state.machineActive ?

                    <div id="prompt-control">
                        <input type="text" id="prompt" autoComplete="off" ref={this.textPromptRef}></input>

                        {this.state.waitingToGenerate  == GENERATE_WAIT_TYPE['dialogue'] ?
                        <button type="button" id="promptSubmit" disabled>dialogue in progress</button>:
                        <button type="button" id="promptSubmit"
                             onClick = {() => this.updatePromptList()}>generate</button>}
                    </div> 
                        
                    : <div></div>

                    }
                </div>

            </div>
        );
    }
}

export default MachinePage;
