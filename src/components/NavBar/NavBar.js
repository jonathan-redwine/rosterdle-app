import React, { Component } from 'react';
import './NavBar.scss';
import { ENTITIES } from '../../constants/entities';

class NavBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <div className="nav-bar__item" onClick={() => this.props.entitySelected(ENTITIES.ABOUT)}>
          About
        </div>
        <div className="nav-bar__item" onClick={() => this.props.entitySelected(ENTITIES.PROJECTS)}>
          Projects
        </div>
        <div className="nav-bar__item" onClick={() => this.props.entitySelected(ENTITIES.RESUME)}>
          Resume
        </div>
        <div className="nav-bar__item" onClick={() => this.props.scrollToBottom()}>
          Contact
        </div>
      </div>
    );
  }
}

export default NavBar;
