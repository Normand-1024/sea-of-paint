import React from 'react';
import '../styles/end.css';

const endData = [
  { image: './assets/images/lily.png', text: 'sample text #1' },
  { image: './assets/images/lily.png', text: 'sample text #2' },
  { image: './assets/images/lily.png', text: 'pretend this one is long, like super super long, just lots of text that keeps going without stopping blah blah blahhhhh' },
];

const EndPage: React.FC = () => {
  return (
    <div className="end-wrapper">
      <h1>End Game Screen</h1>

      <div className="memorabilia-wrapper">
        {endData.map((item) => (
          <div className="memory-wrapper">
            <img className="image" src={item.image}/>
            <p className="text">{item.text}</p>
          </div>
        ))}
      </div>

      <p>Final text blurb goes here.</p>
    </div>
  );
};

export default EndPage;
