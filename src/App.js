import React, { Component } from 'react';
import './App.scss';
import { ENTITIES } from './constants/entities';
import SideBar from './components/SideBar/SideBar';
import Home from './entities/home/Home';
import Game from './entities/game/Game';
import Battle from './entities/battle/Battle';
import HowToPlay from './entities/howToPlay/HowToPlay';
import PageNotFound from './components/PageNotFound/PageNotFound';

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
        return <Home entitySelected={this.entitySelected}></Home>;
      }
      case ENTITIES.GAME: {
        return <Game></Game>;
      }
      case ENTITIES.BATTLE: {
        return <Battle entitySelected={this.entitySelected}></Battle>;
      }
      case ENTITIES.HOW_TO_PLAY: {
        return <HowToPlay></HowToPlay>;
      }
      default: {
        return <PageNotFound entitySelected={this.entitySelected}></PageNotFound>;
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
