import React from 'react';
import '../styles/modals.css';


const InfoPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>Info</h1>
      <div className="info-wrapper">
        <div id="objective">
          <h2>Objective</h2>
          <p>
            In this world, the spirits of the deceased are stored in a digital "Sea." 
            Machines were developed to harness the Sea.
            As an operator of the Machine, your objective is to communicate with the spirits.
          </p>
          <p>
            You've been contracted by Mey's family to generate a memorabilia.
            By temporarily bringing her back and speaking with her, you may learn more about who Mey was and what was important to her and her identity.
            Identify Mey's core values - her story - and decide on which memories to include in her memorabilia.
          </p>
        </div>

        <div id="how-to"> 
          <h2>How-To</h2>
          <p>
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
          </p>
        </div>
      </div>

    </div>
  );
};

export default InfoPage;