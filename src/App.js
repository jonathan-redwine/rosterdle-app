import React, { Component } from 'react';
import './App.scss';
import { ENTITIES } from './constants/entities';
import SideBar from './components/SideBar/SideBar';
import Home from './entities/home/Home';
import Game from './entities/game/Game';
import Battle from './entities/battle/Battle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEntity: ENTITIES.HOME,
    };
  }

  getActiveEntity = () => {
    switch (this.state.activeEntity) {
      case ENTITIES.HOME: {
        return <Home></Home>;
      }
      case ENTITIES.GAME: {
        return <Game></Game>;
      }
      case ENTITIES.BATTLE: {
        return <Battle></Battle>;
      }
      default: {
        return <span>NOTHING SELECTED</span>;
      }
    }
  };

  entitySelected = entity => {
    this.setState({
      activeEntity: entity,
    });
  };

  render() {
    return (
      <div className="App">
        <SideBar entitySelected={this.entitySelected}></SideBar>
        {this.getActiveEntity()}
      </div>
    );
  }
}

export default App;
