/**
 * machine.tsx
 * renders the machine page, which serves as the primary game interface
 * toggles between the machine dialogue view and the machine image generator view
 */
// @ts-ignore

import React, { createRef } from 'react';
import { Story } from 'inkjs';

/** Styles */
import '../styles/machine.css';
import '../styles/buttons.css';
import '../styles/dialogue.css';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

/** Helper Components */
import ImageGenerator from '../components/imageGenerator.tsx';
import { MarkovScrambler } from '../functions/markovGeneration.tsx';

/** Managers */
import { AudioManager } from '../managers/audio'
import { AnimationManager } from '../managers/animation'

import {GENERATE_WAIT_TYPE, MEY_PORTRAIT_PATH, DIALOGUE_TYPE} from '../constants.tsx';


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
    mode: 'machine' | 'control';
    blinking: boolean;
}

class MachinePage extends React.Component<MachineProps, MachineState> {
    state: MachineState = {
        machineActive: true,
        dialogueList: [],
        promptList: [],
        markovScrambler: new MarkovScrambler(),
        dialogueRunner: undefined,
        generateState: GENERATE_WAIT_TYPE['dialogue'],
        hoveredIndex: null,
        clickedIndices: [],
        partialSpiritLine: null,
        meyPortraitState: "mey_def",
        mode: 'machine',
        blinking: false
    };

    private dialogueEndRef = createRef<HTMLDivElement>();
    private textPromptRef = createRef<HTMLInputElement>();

    private audio = new AudioManager();
    private animator = new AnimationManager();

    private dialogueWrapperRef = React.createRef<HTMLDivElement>();
    
	  private tempMemData : (string | number)[] = []; // [index, id1, id2, interpt1, interpt2, imageURL]

    /********** Load the text into markov chain **********/
    componentDidMount() {
        this.state.markovScrambler.initialize("./assets/markovtext.txt");
        window.addEventListener("keydown", this.handleKeyDown);


        fetch("./texts/storytext.json")
        .then((res) => res.text())
        .then((json) => {
            this.setState(() => ({ 
                dialogueRunner: new Story(json)
            }));
        })
        .catch((e) => console.error(e));

        this.audio.play(true);
    }

    componentDidUpdate(prevProps: MachineProps, prevState: MachineState): void {
        /** KK: scroll dialogue into view when animating */
        if (prevState.dialogueList.length === 0 && this.state.dialogueList.length === 1){
            this.dialogueEndRef.current?.parentElement!.scrollTo({ top: 0, behavior: 'auto' });
        } else if (prevState.dialogueList !== this.state.dialogueList || prevState.partialSpiritLine !== this.state.partialSpiritLine) {
            this.dialogueEndRef.current?.scrollIntoView({ behavior: 'auto'});
        }   

        /** KK: only switch audio when crossing between "dialogue" and "non-dialogue" */
        const wasDialogue = prevState.generateState === GENERATE_WAIT_TYPE['dialogue'];
        const isDialogue  = this.state.generateState === GENERATE_WAIT_TYPE['dialogue'];
        if (wasDialogue !== isDialogue) { 
            if ((this.state.mode == 'control' && isDialogue) || (this.state.mode == 'machine' && !isDialogue)) this.setState({ blinking: true });
            this.audio.play(isDialogue); 
        }

    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        this.audio.stop;
    }


    /********** handle key/mouse events **********/
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" && (this.state.partialSpiritLine !== null)) {
            e.preventDefault(); 
            this.handleSkipAnimation();
        }
    }; 

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

    handleSkipAnimation = () => {
        this.animator.skipAnimation(
            () => this.state.dialogueList,
            list    => this.setState({ dialogueList: list }),
            partial => this.setState({ partialSpiritLine: partial })
        );
    };

    handleToggleClick = () => {
        this.setState(
            prev => ({
                mode: prev.mode === 'machine' ? 'control' : 'machine',
                blinking: false,
            }),
            () => {
                const dialogue_position = this.dialogueWrapperRef.current;
                if (dialogue_position) {
                dialogue_position.scrollTop = dialogue_position.scrollHeight;
                }
            }
        );
    }

    /********** handle dialogue **********/
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
                () => {
                    this.animator.animateSpiritText(
                        line!,
                        this.state.dialogueRunner?.currentTags ?? [],
                        () => this.state.dialogueList,
                        list => this.setState({ dialogueList: list }),
                        partial => this.setState({ partialSpiritLine: partial })
                    );
                }
            );            
        } else {
            this.setState(state => ({
                dialogueList: [...state.dialogueList, newEntry]
            }));
        }
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
        this.audio.playClick();
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

    }

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
            return null;
        }
        const { mode, blinking } = this.state;

        return (
            <div className={`machine-page ${mode}-mode`}>

                {/** LEFT PANEL: machine dialogue */}
                <div className="machine-dialogue-display">
                  <div className="portrait-wrapper">
                    <img src={MEY_PORTRAIT_PATH[this.state.meyPortraitState as keyof typeof MEY_PORTRAIT_PATH]} />
                  </div>

                  <div ref={this.dialogueWrapperRef} className="dialogue-column-wrapper"
                    style={{ overflowY: this.state.generateState === GENERATE_WAIT_TYPE["dialogue"] &&
                            (this.state.dialogueRunner.canContinue || this.state.partialSpiritLine !== null) ? "hidden" : "auto"
                          }}>
                    {this.state.dialogueList.map((item, index) => {
                        if (item[0] == DIALOGUE_TYPE['self-speaking'])
                            return (<p key={index} className='self-speaking-line'>{item[1]}</p>);
                        else if (item[0] == DIALOGUE_TYPE['self-thinking'])
                            return (<p key={index} className='self-thinking-line'>{item[1]}</p>);
                        else if (item[0] == DIALOGUE_TYPE['machine']) 
                            return (<p key={index} className='machine-line'>{item[1]}</p>);
                        else {
                            let css = 'spirit-line';
                            /* if (this.state.clickedIndices.includes(index)) {
                                css = 'spirit-line-highlighted';
                            } else if (this.state.hoveredIndex === index) {
                                css = 'spirit-line-hover';
                            } */

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

                    <div id="button-container"> {
                        !this.state.dialogueRunner.canContinue &&
                        this.state.generateState === GENERATE_WAIT_TYPE['dialogue'] ? (
                            (this.state.partialSpiritLine !== null) ? null : (
                            <>
                                {this.state.dialogueRunner.currentChoices.map((op: any, i: number) => {
                                if (op.isInvisibleDefault) return <div key={i}></div>;
                                return (
                                    <button
                                        type="button"
                                        className="dialogue-button"
                                        onClick={() => this.handleDialogue(i)}
                                    >
                                        {op.text}
                                    </button>
                                );
                                })}
                            </>
                            )
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_first'] ? (
                            <button type="button" className="continue-button" disabled>
                                Generate one Image to Continue
                            </button>
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['only_continue_from_generate'] ? (
                            <button type="button" className="continue-button" disabled>
                                Wake up Mey from Core Memories
                            </button>
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_lily2'] ? (
                            <button type="button" className="continue-button" disabled>
                                Unlock Memory of Lily to Continue
                            </button>
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_lily1'] ? (
                            <button type="button" className="continue-button" disabled>
                                Wake up Mey from a Core Memory
                            </button>
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['generated'] ? (
                            <button type="button" className="continue-button" onClick={() => this.setToDialogue()}>
                                Bring back Mey
                            </button>
                        ) : this.state.generateState === GENERATE_WAIT_TYPE['wait_for_interpretations'] ? (
                            <button type="button" className="continue-button" disabled>
                                Finish Interpretations to Continue
                            </button>
                        ) : (
                            !(this.state.partialSpiritLine !== null) && (
                              <button type="button" className="continue-button" onClick={() => this.handleDialogue()}>
                              Continue
                              </button>
                            )
                        )
                    }
                    </div>
                    <div ref={this.dialogueEndRef} />
                    </div>
                </div>

                {/** MIDDLE TOGGLE: switch between dialogue & image generation */}
                <div
                    className={`middle-toggle${blinking ? ' blinking' : ''}`}
                    onClick={this.handleToggleClick}
                    >
                    <SwapHorizIcon className="toggle-icon" />
                </div>

                {/** RIGHT PANEL: machine image generation */}
                <div className="machine-control-display">
                    <ImageGenerator
                        prompts={this.state.promptList}
                        dialogueRunner={this.state.dialogueRunner}
                        setDialogueVar={this.setDialogueVar}
                        initiateScene={this.setToDialogue}
                        generateState={this.state.generateState}
                        fillPromptBox={this.fillPromptBox}
                    />
                    {this.state.machineActive && (
                    <div className="prompt-control">
                        <div className="prompt-wrapper">
                            <input type="text" id="prompt" autoComplete="off" ref={this.textPromptRef} />
                            {this.state.generateState === GENERATE_WAIT_TYPE["dialogue"] ? (
                            <button type="button" id="promptSubmit" disabled>
                                Mey is away
                            </button>
                            ) : (
                            <button
                                type="button"
                                id="promptSubmit"
                                onClick={() => this.updatePromptList()}
                            >
                                Retrieve
                            </button>
                            )}
                        </div>
                        {this.state.dialogueRunner.variablesState["current_stage"] > 0 && (
                        <p id="objective">{this.getObjectiveText()}</p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        );
    }
}

export default MachinePage;