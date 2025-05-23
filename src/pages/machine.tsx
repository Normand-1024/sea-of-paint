import React, {createRef, useState} from 'react';
import { Story } from 'inkjs';

import '../App.css';

// @ts-ignore
import YarnBound from 'yarn-bound';
import ImageGenerator from '../components/imageGenerator.tsx';

import { MarkovScrambler } from '../functions/markovGeneration.tsx';

import {PAGE_STATE, SPIRIT_NAME, MID_INTEGR_THRSH, LOW_INTEGR_THRSH, GENERATE_WAIT_TYPE, MEY_PORTRAIT_PATH} from '../constants.tsx';

const DIALOGUE_TYPE = {'spirit': 0, 'self-speaking': 1, 'self-thinking': 2, 'machine': 3};

type MachineProps = {
    pageState: number;
    setPageState: Function;
    memorabilia: (string | number)[][]; // [id1, id2, interpt1, interpt2, imageURL] x 3
    setMemorabilia: Function;
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
    partialSpiritLine: string | null;
    meyPortraitState: string;
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
        partialSpiritLine: null,
        meyPortraitState: "mey_def",
    };

    private dialogueEndRef = createRef<HTMLDivElement>();
    private textPromptRef = createRef<HTMLInputElement>();

    private audioA1 = new Audio("./assets/audio/B1.mp3")  
    private audioA1prevTimestamp = 0;
    private audioA2 = new Audio("./assets/audio/A1.mp3")
    private audioA2prevTimestamp = 0;

    private clickSound = new Audio("./assets/audio/click.ogg");
    private dialogueSound = new Audio("./assets/audio/dialogue.ogg");
    private isAnimating = false;
    private currentAnimatingText = "";
    
	private tempMemData : (string | number)[] = []; // [index, id1, id2, interpt1, interpt2, imageURL]

    componentDidMount() {

        // *********** Load the text into markov chain ***********

        this.state.markovScrambler.initialize("./assets/markovtext.txt");

        window.addEventListener("keydown", this.handleKeyDown);

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

        this.audioA1.preload = "auto";
        this.audioA2.preload = "auto";
        this.playAudio();
    }
    
    componentDidUpdate(prevProps: MachineProps, prevState: MachineState): void {
        if (prevState.generateState !== this.state.generateState || prevState.dialogueList != this.state.dialogueList) {
            this.dialogueEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end'});
        }   

        if (prevState.generateState !== this.state.generateState) {
            this.playAudio();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        this.stopAudio();
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" && this.isAnimating) {
            e.preventDefault(); 
            this.handleSkipAnimation();
        }
    };    

    // KK: function to switch the current audio based on machine state (dialogue or image generation)
    playAudio() {
        if (!this.state.machineActive) return;
    
        const FADE_DURATION = 1000; // KK: these are in miliseconds
        const STEP_TIME = 100;      
        const STEPS = FADE_DURATION / STEP_TIME;
    
        const isDialogue = this.state.generateState === GENERATE_WAIT_TYPE['dialogue'];
    
        const fadeOut = (audio: HTMLAudioElement, callback: () => void) => {
            const step = audio.volume / STEPS;
            const fadeInterval = setInterval(() => {
                audio.volume = Math.max(0, audio.volume - step);
                if (audio.volume <= 0.01) {
                    clearInterval(fadeInterval);
                    audio.pause();
                    callback();
                }
            }, STEP_TIME);
        };
    
        const fadeIn = (audio: HTMLAudioElement) => {
            audio.volume = 0;
            audio.loop = true;
            audio.play().catch(err => console.error("Audio failed to play:", err));
    
            const step = 1 / STEPS;
            const fadeInterval = setInterval(() => {
                audio.volume = Math.min(1, audio.volume + step);
                if (audio.volume >= 0.99) {
                    clearInterval(fadeInterval);
                }
            }, STEP_TIME);
        };
    
        if (!isDialogue) {
            fadeOut(this.audioA2, () => {
                this.audioA1.currentTime = this.audioA1prevTimestamp;
                this.audioA2prevTimestamp = this.audioA2.currentTime;
                console.log("starting A1 audio at: ", this.audioA1.currentTime);
                fadeIn(this.audioA1);
            });
        } else {
            fadeOut(this.audioA1, () => {
                this.audioA2.currentTime = this.audioA2prevTimestamp;
                this.audioA1prevTimestamp = this.audioA1.currentTime;
                console.log("starting A2 audio at: ", this.audioA2.currentTime);
                fadeIn(this.audioA2);
            });
        }
    }  

    stopAudio() {
        this.audioA1.pause();
        this.audioA1.currentTime = 0;
        this.audioA2.pause();
        this.audioA2.currentTime = 0;
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
            this.dialogueEndRef.current?.scrollIntoView(true);
        } 

        this.forceUpdate();
    }

    setToDialogue = (memData : (string | number)[] = []) => {
        if (this.state.dialogueRunner?.variablesState["scene_var"] == "A2_Memorabilia"){
            this.state.dialogueRunner.ChoosePathString("A2_Memorabilia");
            this.tempMemData = memData;
        }

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

                try {
                    line = this.state.markovScrambler.markovScramble(this.state.dialogueRunner.currentText);
                    line = this.state.markovScrambler.markovScramble(line);
                }
                catch (error) {
                    console.log(error);
                    line = this.state.markovScrambler.generate();
                }
            }
        }

        if (!line) line = "";
        const newEntry: [number, string] = [dialogueType, line];

        if (dialogueType === DIALOGUE_TYPE['spirit']) {
            this.setState(
                state => ({
                    dialogueList: [...state.dialogueList, [DIALOGUE_TYPE['spirit'], ""]],
                    partialSpiritLine: ""
                }),
                () => this.animateSpiritText(line!)
            );            
        } else {
            this.setState(state => ({
                dialogueList: [...state.dialogueList, newEntry]
            }));
        }
    }

    // KK: shows the spirit dialogue letter by letter for a more engaging approach to dialogue
    animateSpiritText = async (fullText: string) => {
        let blipEvery = 6;    //KK: adjust to be faster/slower as needed
        let waitTime = 10;
        let current = "";
    
        this.isAnimating = true;
        this.currentAnimatingText = fullText;

        // Adjust animation speed
        if (this.state.dialogueRunner != undefined &&
            this.state.dialogueRunner.currentTags != undefined){

            if (this.state.dialogueRunner.currentTags.indexOf('anim--') > -1) {
                waitTime = 45; 
                blipEvery = 3;
            }
            // else if (this.state.dialogueRunner.currentTags.indexOf('anim') > -1) {
            //     waitTime = 15; 
            //     blipEvery = 6;
            // }
            // else {
            //     this.isAnimating = false;
            // }
        }
    
        for (let i = 0; i < fullText.length; i++) {
            if (!this.isAnimating) {
                break;
            }
    
            const char = fullText[i];
            current += char;
            this.setState({ partialSpiritLine: current });
    
            if (i % blipEvery === 0 && /[a-zA-Z0-9]/.test(char)) {
                this.dialogueSound.currentTime = 0;
                this.dialogueSound.play().catch(() => {});
            }
    
            // KK: pause at end of sentence
            if (char === "." || char === "?" || char === "!") {
                await new Promise(res => setTimeout(res, 250));
            } else {
                await new Promise(res => setTimeout(res, waitTime));
            }
        }
    
        this.setState(state => {
            const updated = [...state.dialogueList];
            updated[updated.length - 1] = [DIALOGUE_TYPE['spirit'], fullText];
            return { dialogueList: updated, partialSpiritLine: null };
        });
    
        this.isAnimating = false;
        this.currentAnimatingText = "";
    };

    // KK: skips dialogue animation with button press
    handleSkipAnimation = () => {
        if (this.isAnimating && this.currentAnimatingText) {
            this.isAnimating = false;
    
            this.setState(state => {
                const updated = [...state.dialogueList];
                updated[updated.length - 1] = [DIALOGUE_TYPE['spirit'], this.currentAnimatingText];
                return { dialogueList: updated, partialSpiritLine: null };
            });
        }
    };
    
    activateMachine = () => {
        if(!this.state.dialogueRunner) {
            console.log("dialogueRunner is undefined")
            return
        }

        this.setState(
            { machineActive: true },
            () => {
                this.playAudio();
            }
        );

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

    fillPromptBox = (text : string) => {
        if (this.textPromptRef.current) this.textPromptRef.current.value = text;
        else console.log("fillPromptBox: textPromptRef.current returns false")
    }

    handleDialogue = (option : number = -1) => {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
        console.log("played click audio")

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

        // If make_memora is true, then start inputting memorabilia
        if (this.state.dialogueRunner.currentTags &&
            this.state.dialogueRunner.currentTags.indexOf('make_memora') > -1) {
                this.tempMemData[3] = this.state.dialogueRunner.variablesState["mem_1_interp"];
                this.tempMemData[4] = this.state.dialogueRunner.variablesState["mem_2_interp"];

                this.props.setMemorabilia(
                    this.props.memorabilia.map((mem, index) => {
                        if (index == this.tempMemData[0]){
                            return this.tempMemData.slice(1);
                        }
                        else {
                            return mem;
                        }
                    }
                ))
        }

        // If #generate is true, get into image generation mode
        if (this.state.dialogueRunner.currentTags &&
            this.state.dialogueRunner.currentTags.indexOf('generate') > -1) {
            
            if (this.state.dialogueRunner.variablesState["current_stage"] < 4)
                this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['only_continue_from_generate'] }));
            else
                this.setState(() => ({ generateState: GENERATE_WAIT_TYPE['wait_for_first'] }));

        } // TODO: add wait_for_first after the 3 core memories are found
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

        // Change Mey's portrait here
        for (let mey_tag of Object.keys(MEY_PORTRAIT_PATH)){
            // console.log("Checking " + mey_tag + " " + this.state.dialogueRunner.currentTags?.indexOf(mey_tag));
            if (this.state.dialogueRunner.currentTags && this.state.dialogueRunner.currentTags.indexOf(mey_tag) > -1) {
                console.log("Changing Mey to " + mey_tag);
                this.setState(() => ({ meyPortraitState: mey_tag }));
                break;
            }
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

    getObjectiveText = () => {
        if (this.state.dialogueRunner?.variablesState["current_stage"] == 1)
            return "Find a Core Memory";
        else if (this.state.dialogueRunner?.variablesState["current_stage"] == 2)
            return "Unlock the Memory of Lily";
        else if (this.state.dialogueRunner?.variablesState["current_stage"] == 3)
            return this.state.dialogueRunner?.variablesState["core_unlocked"] + " out of 3 Core Memories Retrieved";
        else if (this.state.dialogueRunner?.variablesState["current_stage"] == 4)
            return "Make one Memorabilium";
        else if (this.state.dialogueRunner?.variablesState["current_stage"] == 5)
            return "Conclude Contract when Ready";

        return "No supposed to be here";
    }

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
                                : MEY_PORTRAIT_PATH[this.state.meyPortraitState as keyof typeof MEY_PORTRAIT_PATH]
                            }
                        style={{position: this.state.machineActive ? "absolute" : "relative",
                                right: this.state.machineActive ? "82%" : "0",
                                height: this.state.machineActive ? "" : "40%"}}>
                    </img>

                    <div id="dialogueCol"
                        style={{height: this.state.machineActive ? "90%" : "60%",
                                overflowY: this.state.generateState==GENERATE_WAIT_TYPE["dialogue"] 
                                && (this.state.dialogueRunner.canContinue 
                                    //|| this.state.dialogueRunner.currentChoices.length < 2
                                    || this.isAnimating) ? "hidden" : "auto"
                        }}>
                    
                        <div id="dialogue">
                            {this.state.dialogueList.map((item,index) => {
                                if (item[0] == DIALOGUE_TYPE['self-speaking'])
                                    return (<p key={index} className='self-speaking-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['self-thinking'])
                                    return (<p key={index} className='self-thinking-line'>{item[1]}</p>);
                                else if (item[0] == DIALOGUE_TYPE['machine']) 
                                    return (<p key={index} className='machine-line'>{item[1]}</p>);
                                else {
                                    let css = 'spirit-line';
                                    if (this.state.clickedIndices.includes(index)) {
                                        css = 'spirit-line';
                                    } else if (this.state.hoveredIndex === index) {
                                        css = 'spirit-line';
                                    }

                                    const isLast = index === this.state.dialogueList.length - 1;
                                    const shouldAnimate = item[0] === DIALOGUE_TYPE['spirit'] && this.state.partialSpiritLine !== null;

                                    return (
                                        <p
                                            key={index}
                                            className={css}
                                            onMouseEnter={() => this.handleMouseEnter(index)}
                                            onMouseLeave={this.handleMouseLeave}
                                            onClick={() => this.handleClick(index)}
                                        >
                                            {shouldAnimate && isLast ? this.state.partialSpiritLine : item[1]}
                                        </p>
                                    );
                                }
                            })}
                        </div>

                        <div id="button-container">
                        {
                            !this.state.machineActive ? (
                            <div className="button-div">
                                <button type="button" className="dialogue-button" onClick={this.activateMachine}>
                                Activate Machine, bring back Mey
                                </button>
                            </div>
                            ) : (
                            !this.state.dialogueRunner.canContinue &&
                            this.state.generateState === GENERATE_WAIT_TYPE['dialogue'] ? (
                                this.isAnimating ? null : (
                                <>
                                    {this.state.dialogueRunner.currentChoices.map((op: any, i: number) => {
                                    if (op.isInvisibleDefault) return <div key={i}></div>;
                                    return (
                                        <div className="button-div" key={i}>
                                        <button
                                            type="button"
                                            className="dialogue-button"
                                            onClick={() => this.handleDialogue(i)}
                                        >
                                            {op.text}
                                        </button>
                                        </div>
                                    );
                                    })}
                                </>
                                )
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_first'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" disabled>
                                    Generate one Image to Continue
                                </button>
                                </div>
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['only_continue_from_generate'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" disabled>
                                    Wake up Mey from Core Memories
                                </button>
                                </div>
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_lily2'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" disabled>
                                    Unlock the Core Memory of Lily to Continue
                                </button>
                                </div>
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_lily1'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" disabled>
                                    Wake up Mey from a Core Memory
                                </button>
                                </div>
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['generated'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" onClick={() => this.setToDialogue()}>
                                    Bring back Mey
                                </button>
                                </div>
                            ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_interpretations'] ? (
                                <div className="button-div">
                                <button type="button" className="continue-button" disabled>
                                    Finish Interpretations to Continue
                                </button>
                                </div>
                            ) : (
                                !this.isAnimating && (
                                <div className="button-div">
                                    <button type="button" className="continue-button" onClick={() => this.handleDialogue()}>
                                    Continue
                                    </button>
                                </div>
                                )
                            )
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
                                    initiateScene = {this.setToDialogue}
                                    generateState = {this.state.generateState}
                                    fillPromptBox = {this.fillPromptBox} ></ImageGenerator>

                    { 
                    
                    this.state.machineActive ?

                    <div id="prompt-control">
                        <input type="text" id="prompt" autoComplete="off" ref={this.textPromptRef}></input>


                        {this.state.generateState  == GENERATE_WAIT_TYPE['dialogue'] ?
                        <button type="button" id="promptSubmit" disabled>Mey is away</button>
                        :
                        <button type="button" id="promptSubmit"
                             onClick = {() => this.updatePromptList()}>Retrieve</button>}

                        { this.state.dialogueRunner.variablesState["current_stage"] > 0 ?
                            <p id="objective">{this.getObjectiveText()}</p> : (null)
                        }
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