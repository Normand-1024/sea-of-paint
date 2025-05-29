import React from 'react';
import '../styles/menu.css';
import { PAGE_STATE } from '../constants.tsx';

type MenuProps = {
  pageState: number;
  setPageState: Function;
}

class MainMenuPage extends React.Component<MenuProps> {
    nextPage = () => {
        this.props.setPageState(PAGE_STATE['intro']);
    }

    render() {
        return (
            <div className="menu-wrapper">
                <h1>Main Menu</h1>

                <p>Introduce the game and how-to here.</p>

                <button onClick={this.nextPage} className="button">
                    Start Game
                </button>
            </div>
        );
    }
};

export default MainMenuPage;