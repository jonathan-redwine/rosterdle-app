import React, { Component } from 'react';
import './SideBar.scss';
import { ENTITIES } from '../../constants/entities';
import Logo from '../../assets/logo.png';

class SideBar extends Component {
  render() {
    return (
      <div className="side-bar">
        <div className="side-bar__header">
          <img src={Logo} alt="logo" />
        </div>
        <div className="side-bar__nav">
          <div className="side-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.HOME)}>
            Home
          </div>
          <div className="side-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.GAME)}>
            Game
          </div>
          <div className="side-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.BATTLE)}>
            Battle
          </div>
        </div>
        <div className="side-bar__footer">© 2024 Jonathan Redwine. All rights reserved.</div>
      </div>
    );
  }
}

export default SideBar;
