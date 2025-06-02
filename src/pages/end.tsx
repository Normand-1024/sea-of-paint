import React from 'react';
import '../styles/end.css';

import { IMAGE_DATA } from '../../public/assets/images/imageData.tsx';


interface EndPageProps {
    pageState: number;
    setPageState: Function;
    memorabilia: (string | number)[][]; // [id1, id2, interpt1, interpt2, imageURL] x 3
}

function EndPage({ pageState, setPageState, memorabilia }: EndPageProps) {
  
    let imgData: { [id: string] : any; } = {}; // name : all other data in IMAGE_DATA
    for (var imgd of IMAGE_DATA) {
          let name = imgd["name"];
          imgData[name] = imgd;
    }

    memorabilia[0] = ['lily', 'lily2', 0, 0, "./assets/images/ivan2.png"];

  return (
    <div className="end-wrapper">
      <h1>End Game Screen</h1>

      <div className="memorabilia-wrapper">
        {memorabilia.map((item, index) => (
            <div className="memory-wrapper" key={index}>
              {item[0] != "" && <img className="image" src={item[4].toString()}/>}
              {item[0] != "" && <p className="text">{imgData[item[0]]["memorabilia"][item[2]] + ", and she" +
                                  imgData[item[1]]["memorabilia"][item[3]].slice(3)}.</p>}
            </div>
        ))}
      </div>

      <p>Final text blurb goes here.</p>
    </div>
  );
};

export default EndPage;
