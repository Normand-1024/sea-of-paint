import React from 'react';
import '../styles/modals.css';


const InfoPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>Machine Operation Help</h1>
      <small><p>You can press Spacebar to skip the dialogue animation.</p></small>
      <div className="info-wrapper">
        <div id="objective">
          <h2>Searching the Sea</h2>
          <p>
            The Machine has two modes: talking to the spirit and searching the Sea. A vertical bar would flash when switching is needed. Click on the bar to switch modes.
          </p>
          <p>
            The Machine Operator searches the Sea by entering a text prompt and clicking the "Retrieve" button.
          </p>
          <p>
            The Machine will return at most five memories, sorted by the similarities between the prompt and each memory's text description.
          </p>
          <p>
            Only the top memory will be fully displayed with its text prompt, but the image can surface the top two memories. 
          </p>
          <p>
            The Machine Operator can click on the memory titles to copy its partial description to the prompt box.
          </p>
          {/* <p>
            In this world, the spirits of the deceased are stored in a digital "Sea." 
            Machines were developed to harness the Sea.
            As an operator of the Machine, your objective is to communicate with the spirits.
          </p>
          <p>
            You've been contracted by Mey's family to generate a memorabilia.
            By temporarily bringing her back and speaking with her, you may learn more about who Mey was and what was important to her and her identity.
            Identify Mey's core values - her story - and decide on which memories to include in her memorabilia.
          </p> */}
        </div>

        <div id="how-to"> 
          <h2>Retrieving Memories</h2>
          <p>
            A memory can only be retrieved after discussion with the spirit. "Inquiry Needed" will be displayed for the top memory if discussion is needed. An undiscussed top memory should have a button that initiates the discussion.
          </p>
          <p>
            An unretrieved memory's text description is incomplete, marked with "[?]"s in its description. A Machine Operator's job is to fill in the question marks. As a shortcut, the text description for the top memory can be copied to the text prompt box by clicking.
          </p>
          <p>
            Once a memory's similarity is above 85%. The memory will be successfully retrieved. And it will turn gold.
          </p>
          {/* <p>
            The Machine has two screens: the spirit dialogue and the image generator.
            Toggle between both screens using the middle bar.
          </p>
          <p>
            Generate memories by identifying what's important to Mey in your discussions with her. 
            Memories that are ready to be unlocked will be blue.
          </p>
          <p>
            Discovered memories will turn yellow and will be able to be added to the Memorabilia.
            Collect three memories to complete the game.
            But remember: you need to accurately represent Mey and her story for your client to be satisfied!
          </p> */}
        </div>
      </div>

    </div>
  );
};

export default InfoPage;