import React, {createRef, useState} from 'react';
import { Story } from 'inkjs';

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
    dialogueRunner: Story|undefined;
    generateState: number;
    hoveredIndex: number | null;
    clickedIndices: number[];
}

class MachinePage extends React.Component<MachineProps, MachineState> {
    state: MachineState = {
        machineActive: false,
        dialogueList: [],
        promptList: [],
        markovScrambler: new MarkovScrambler(),
        dialogueRunner: undefined,
        generateState: GENERATE_WAIT_TYPE['dialogue'],
        hoveredIndex: null,
        clickedIndices: [],
    };

    private dialogueEndRef = createRef<HTMLDivElement>();
    private textPromptRef = createRef<HTMLInputElement>();

    componentDidMount() {

        // *********** Load the text into markov chain ***********

        this.state.markovScrambler.initialize("./assets/markovtext.txt");

        // *********** Load the yarn ink into dialogueRunner ***********
        // fetch("./texts/dialogue.yarn")
        // .then((res) => res.text())
        // .then((text) => {
        //     this.setState(() => ({
        //         dialogueRunner: new YarnBound({
        //             dialogue: text,
        //             variableStorage: this.state.dialogueVar
        //         })
        //     }));
        // })
        // .catch((e) => console.error(e));
        fetch("./texts/storytext.json")
        .then((res) => res.text())
        .then((json) => {
            this.setState(() => ({ 
                dialogueRunner: new Story(json)
            }))
        })
        .catch((e) => console.error(e));
    }

    componentDidUpdate(prevProps: MachineProps, prevState: MachineState): void {
        if (prevState.dialogueList.length != this.state.dialogueList.length) {
            this.dialogueEndRef.current?.scrollIntoView(false);
        }
    }

    setDialogueVar = (v : string, value : any) => {
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined");
            return
        }

        this.state.dialogueRunner.variablesState[v] = value;

        // Check if there's any interpretations left open
        if (this.state.generateState == GENERATE_WAIT_TYPE['wait_for_lily2'] &&
            this.state.dialogueRunner.variablesState["lily"] >= 0){
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['generated'] })); 
        } 

        this.forceUpdate();
    }

    setToDialogue = () => {
        this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['dialogue'] }));
    }

    pushDialogue = (line: string | null, dialogueType : number = DIALOGUE_TYPE['spirit']) => {
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined");
            return
        }

        if (this.state.dialogueRunner.currentTags &&
            this.state.dialogueRunner.currentTags.indexOf('self') > -1) {

            dialogueType = DIALOGUE_TYPE['self-thinking'];
        }
        else {
            // Check scrambling
            if (this.state.dialogueRunner.currentTags &&
                this.state.dialogueRunner.currentTags.indexOf('scramble') > -1){
                line = this.state.markovScrambler.markovScramble(this.state.dialogueRunner.currentText);
                line = this.state.markovScrambler.markovScramble(line);
            }
        }

        if(!line) line = "";
        let new_entry : [number, string] = [dialogueType, line];

        this.setState((state) => ({
            dialogueList: [...state.dialogueList, new_entry]
        }));
    }

    activateMachine = () => {
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined")
            return
        }

        this.setState(() => ({
            machineActive: true
        }));

        //this.updatePromptList(); // generate a random image
        
        this.pushDialogue(this.state.dialogueRunner.Continue());
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
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined");
            return
        }

        let original_integr = this.state.dialogueRunner.variablesState["integrity"];

        // Whether dialogueRunner.currentResult is option or text
        //  is handled in the HTML, communiated thru the option param
        // Except the machine prompt, which is not added to the dialogue
        if (option >= 0){
            this.state.dialogueRunner.ChooseChoiceIndex(option);

            if (this.state.dialogueRunner.variablesState["noprint"]){
                // If $noprint is true, do not print this dialogue option.
                
                this.setDialogueVar("noprint", false);
                this.state.dialogueRunner.Continue();
            } 
            else    
                this.pushDialogue(this.state.dialogueRunner.Continue(), DIALOGUE_TYPE["self-speaking"]);
        }

        // Push the current text
        if (this.state.dialogueRunner.canContinue) {
            this.pushDialogue(this.state.dialogueRunner.Continue());
        }
        
        // If $follow is true, print the next statement
        // while (this.state.dialogueRunner.currentTags &&
        //     this.state.dialogueRunner.currentTags.indexOf('follow') > -1) {
        //         this.pushDialogue(this.state.dialogueRunner.Continue());
        // }

        // If #generate is true, get into image generation mode
        if (this.state.dialogueRunner.currentTags &&
            this.state.dialogueRunner.currentTags.indexOf('generate') > -1) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_first'] }));
        }
        else if (this.state.dialogueRunner.currentTags &&
                this.state.dialogueRunner.currentTags.indexOf('generate_lily1') > -1) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_lily1'] }));
        }
        else if (this.state.dialogueRunner.currentTags &&
            this.state.dialogueRunner.currentTags.indexOf('generate_lily2') > -1) {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_lily2'] }));
        }
        else {
            this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['dialogue'] }));
        }

        // Handle announcement when thresholds are crossed
        // if (original_integr > MID_INTEGR_THRSH &&
        //         this.state.dialogueRunner.variablesState["integrity"] < MID_INTEGR_THRSH) {
        //     this.pushSelfDialogue(SPIRIT_NAME + " is overwhelmed by the Voices", 
        //         DIALOGUE_TYPE['self-thinking']);
        // }
        // else if (original_integr > LOW_INTEGR_THRSH &&
        //         this.state.dialogueRunner.variablesState["integrity"] < LOW_INTEGR_THRSH) {
        //     this.pushSelfDialogue(SPIRIT_NAME + " is lost to the Sea", 
        //         DIALOGUE_TYPE['self-thinking']);
        // }
    }
    
    printSomething = () => {
        console.log("123");
    }

    handleMouseEnter = (index: number) => {
        this.setState({ hoveredIndex: index });
    };

    handleMouseLeave = () => {
        this.setState({ hoveredIndex: null });
    };

    handleClick = (index: number) => {
        this.setState((prevState) => {
            const { clickedIndices } = prevState;
            // unhighlights if the text is already highlighted, otherwise highlights -KK
            if (clickedIndices.includes(index)) {
                return { clickedIndices: clickedIndices.filter(i => i !== index) };
            } else {
                return { clickedIndices: [...clickedIndices, index] };
            }
        });
    };

    render() {
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined");
            return
        }

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
                                if (item[0] == DIALOGUE_TYPE['self-speaking'])
                                    return (<p key={index} className='self-speaking-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['self-thinking'])
                                    return (<p key={index} className='self-thinking-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['machine']) 
                                    return (<p key={index} className='machine-line'>{item[1]}</p>);
                                else{ 
                                    let css = 'spirit-line';
                                    if (this.state.clickedIndices.includes(index)) {
                                        css = 'spirit-line';//'spirit-line-highlighted';
                                    } else if (this.state.hoveredIndex === index) {
                                        css = 'spirit-line';//'spirit-line-hover';
                                    }

                                    return (
                                        <p
                                            key={index}
                                            className={css}
                                            onMouseEnter={() => this.handleMouseEnter(index)}
                                            onMouseLeave={this.handleMouseLeave}
                                            onClick={() => this.handleClick(index)}
                                        >
                                            {item[1]}
                                        </p>
                                    );
                                }
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
                                !this.state.dialogueRunner.canContinue &&
                                this.state.generateState ==  GENERATE_WAIT_TYPE['dialogue'] ?

                                this.state.dialogueRunner.currentChoices.map(
                                    (op:any,i:number) => {                      
                                        return (
                                            
                                            !op.isInvisibleDefault ? 

                                            <div className="button-div" key={i}><button key={i} 
                                                type="button" className="dialogue-button"
                                                onClick = {() => this.handleDialogue(i)}>
                                                    {op.text}
                                            </button></div> : <div></div>
                                        );
                                }) 
                                
                                :
                                
                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_first']?  
                                
                                <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Generate one Image to Continue
                                    </button>
                                </div> 
                                        
                                :

                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_lily2']?
                                        
                                <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Unlock Memory of Lily to Continue
                                    </button>
                                </div>   

                                :

                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_lily1']?
                                
                                <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Find a Core Memory
                                    </button>
                                </div>   

                                :

                                this.state.generateState ==  GENERATE_WAIT_TYPE['generated']?
                                    
                                <div className="button-div">
                                    <button type="button" className="continue-button" 
                                        onClick = {() => this.setToDialogue()}>
                                        Bring back Mey
                                    </button>
                                </div>

                                :

                                this.state.generateState ==  GENERATE_WAIT_TYPE['wait_for_interpretations']?

                                <div className="button-div">
                                    <button type="button" className="continue-button" disabled>
                                        Finish Interpretations to Continue
                                    </button>
                                </div> 

                                :
                                    
                                <div className="button-div">
                                    <button type="button" className="continue-button" 
                                        onClick = {() => this.handleDialogue()}>
                                        Continue
                                    </button>
                                </div>
                            )
                            }
                        </div>

                        <div ref={this.dialogueEndRef}></div>
                    
                    </div>
                </div>

                <div id="machineControl">
                    <ImageGenerator prompts = {this.state.promptList}
                                    dialogueRunner = {this.state.dialogueRunner}
                                    setDialogueVar  = {this.setDialogueVar}
                                    initiateScene = {this.setToDialogue} ></ImageGenerator>

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