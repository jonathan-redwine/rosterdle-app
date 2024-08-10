import React, { Component } from 'react';
import './Footer.scss';
import LinkedInImg from '../../assets/linkedin.png';
import InstagramImg from '../../assets/instagram.png';
import EmailImg from '../../assets/email.png';
//import BuyMeACoffee from '../../assets/buymeacoffee.png';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="footer__content">
          <div className="footer__content-header">Want to chat?</div>
          <div className="footer__content-message">
            Whether you have a question, an opportunity, or you just want to say hello, I'm always open for a
            conversation.
          </div>
          <div className="footer__content-btns-container">
            <a href="mailto:jredwine1@gmail.com">
              <img src={EmailImg} alt="email" className="media-btn"></img>
            </a>
            <a href="https://www.linkedin.com/in/jonathan-redwine-168300ab/" target="_blank" rel="noreferrer">
              <img src={LinkedInImg} alt="linkedin" className="media-btn"></img>
            </a>
            <a href="https://www.instagram.com/jonathanredwine/" target="_blank" rel="noreferrer">
              <img src={InstagramImg} alt="instagram" className="media-btn"></img>
            </a>
            {/* Maybe one day we add the buymeacoffee link
            <a href="https://buymeacoffee.com/jredwine1i" target="_blank" rel="noreferrer">
              <img src={BuyMeACoffee} alt="buymeacoffee" className="media-btn"></img>
            </a>
            */}
          </div>
        </div>
        <div className="footer__copyright">© 2024 Jonathan Redwine. All rights reserved.</div>
      </div>
    );
  }
}

export default Footer;
