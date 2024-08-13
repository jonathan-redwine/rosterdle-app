import React, { Component } from 'react';
import './SideBar.scss';
import { ENTITIES } from '../../constants/entities';
import Logo from '../../assets/logo.png';

class SideBar extends Component {
  render() {
    return (
      <div className="nav-bar">
        <div className="nav-bar__header">
          <img src={Logo} alt="logo" />
        </div>
        <div className="nav-bar__nav">
          <div className="nav-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.HOME)}>
            Home
          </div>
          <div className="nav-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.GAME)}>
            Game
          </div>
          <div className="nav-bar__nav-item" onClick={() => this.props.entitySelected(ENTITIES.BATTLE)}>
            Battle
          </div>
        </div>
        <div className="nav-bar__footer">© 2024 Jonathan Redwine. All rights reserved.</div>
      </div>
    );
  }
}

export default SideBar;
