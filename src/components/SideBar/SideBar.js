import React from 'react';
import './SideBar.scss';
import { ENTITIES } from '../../constants/entities';
import Logo from '../../assets/logo.png';
import Home from '../../assets/home.png';
import Question from '../../assets/question.png';
import User from '../../assets/user.png';
import Coffee from '../../assets/coffee.png';
import Email from '../../assets/email.png';

const SideBar = props => {
  const getEmailLabelClasses = () => {
    return `side-bar__top__nav-item__label ${props.user ? 'email' : ''}`;
  };

  return (
    <div className="side-bar">
      <div className="side-bar__top">
        <img className="side-bar__top__logo" src={Logo} alt="logo" />
        <div className="side-bar__top__nav-item" onClick={() => props.entitySelected(ENTITIES.HOME)}>
          <img className="side-bar__top__nav-item__img" src={Home} alt="Home"></img>
          <span className="side-bar__top__nav-item__label">HOME</span>
        </div>
        <div className="side-bar__top__nav-item" onClick={() => props.entitySelected(ENTITIES.HOW_TO_PLAY)}>
          <img className="side-bar__top__nav-item__img" src={Question} alt="How to play"></img>
          <span className="side-bar__top__nav-item__label">HOW TO PLAY</span>
        </div>
        <div className="side-bar__top__nav-item" onClick={() => props.entitySelected(ENTITIES.LOGIN)}>
          <img className="side-bar__top__nav-item__img" src={User} alt="Login/register"></img>
          <span className={getEmailLabelClasses()}>{props.user ? props.user.email : 'LOGIN / REGISTER'}</span>
        </div>
      </div>
      <div className="side-bar__bottom">
        <div className="side-bar__bottom-icons">
          <a href="mailto:rosterdle@gmail.com">
            <img src={Email} alt="email" className="media-btn"></img>
          </a>
          <a href="https://buymeacoffee.com/jredwine1i" target="_blank" rel="noreferrer">
            <img src={Coffee} alt="buy me a coffee" className="media-btn"></img>
          </a>
        </div>
        <span>© 2024 Rosterdle. All rights reserved.</span>
      </div>
    </div>
  );
};

export default SideBar;
