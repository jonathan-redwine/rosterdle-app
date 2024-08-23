import React, { Component } from 'react';
import './SideBar.scss';
import { ENTITIES } from '../../constants/entities';
import Logo from '../../assets/logo.png';
import Home from '../../assets/home.png';
import Question from '../../assets/question.png';
import User from '../../assets/user.png';
import Mail from '../../assets/mail.png';
import Coffee from '../../assets/coffee.png';

class SideBar extends Component {
  render() {
    return (
      <div className="side-bar">
        <div className="side-bar__top">
          <img className="side-bar__top__logo" src={Logo} alt="logo" />
          <div className="side-bar__top__nav-item" onClick={() => this.props.entitySelected(ENTITIES.HOME)}>
            <img className="side-bar__top__nav-item__img" src={Home} alt="Home"></img>
            <span className="side-bar__top__nav-item__label">HOME</span>
          </div>
          <div className="side-bar__top__nav-item" onClick={() => this.props.entitySelected(ENTITIES.HOW_TO_PLAY)}>
            <img className="side-bar__top__nav-item__img" src={Question} alt="How to play"></img>
            <span className="side-bar__top__nav-item__label">HOW TO PLAY</span>
          </div>
          <div className="side-bar__top__nav-item" onClick={() => this.props.entitySelected(ENTITIES.LOGIN)}>
            <img className="side-bar__top__nav-item__img" src={User} alt="Login/register"></img>
            <span className="side-bar__top__nav-item__label">LOGIN / REGISTER</span>
          </div>
          <div className="side-bar__top__nav-item" onClick={() => this.props.entitySelected(ENTITIES.CONTACT)}>
            <img className="side-bar__top__nav-item__img" src={Mail} alt="Contact"></img>
            <span className="side-bar__top__nav-item__label">CONTACT</span>
          </div>
        </div>
        <div className="side-bar__bottom">
          <a href="https://buymeacoffee.com/jredwine1i" target="_blank" rel="noreferrer">
            <img src={Coffee} alt="buy me a coffee" className="media-btn"></img>
          </a>
          <span>© 2024 Rosterdle. All rights reserved.</span>
        </div>
      </div>
    );
  }
}

export default SideBar;
