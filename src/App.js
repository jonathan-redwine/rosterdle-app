import React, { Component } from 'react';
import './App.scss';
import { ENTITIES } from './constants/entities';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import About from './entities/about/About';
import Projects from './entities/projects/Projects';
import Resume from './entities/resume/Resume';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeEntity: ENTITIES.ABOUT };
  }

  getActiveEntity = () => {
    switch (this.state.activeEntity) {
      case ENTITIES.ABOUT: {
        return <About scrollToBottom={this.scrollToBottom}></About>;
      }
      case ENTITIES.PROJECTS: {
        return <Projects></Projects>;
      }
      case ENTITIES.RESUME: {
        return <Resume></Resume>;
      }
      default: {
        return <span>NOTHING SELECTED</span>;
      }
    }
  };

  scrollToBottom = () => {
    this.bottom.scrollIntoView({ behavior: 'smooth' });
  };

  entitySelected = entity => {
    this.setState({
      activeEntity: entity,
    });
  };

  render() {
    return (
      <div className="App">
        <NavBar entitySelected={this.entitySelected} scrollToBottom={this.scrollToBottom}></NavBar>
        {this.getActiveEntity()}
        <Footer></Footer>
        <div
          ref={el => {
            this.bottom = el;
          }}
        ></div>
      </div>
    );
  }
}

export default App;
