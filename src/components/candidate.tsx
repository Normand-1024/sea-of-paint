import React, {useEffect} from 'react';
import '../App.css'

type CandidateProps = {
    inprompt: string;
    imageurl: string;
}

type CandidateState = {
}

export class Candidate extends React.Component<CandidateProps, CandidateState> {
    state: CandidateState = {
        imageurl: "public/assets/images/placeholder.jpg"
    }

    render() {
        return (
            <div className = "candidate">

                <img src={this.props.imageurl} style={{'width': '60%'}}></img>
                <p style={{'marginTop': 0}}>{this.props.inprompt}</p>

            </div>
        )
    }
};

    
export default Candidate;