import React, { Component } from 'react';
import './About.scss';
import ProfilePic from '../../assets/profile_pic.jpg';

class About extends Component {
  render() {
    return (
      <div className="about">
        <div className="about__main">
          <div className="about__main__pic-container">
            <img src={ProfilePic} alt="profile-pic" className="about__main__pic-container__pic"></img>
          </div>
          <div className="about__main__info">
            <div className="about__main__info-about">
              <div className="about__main__info-about-name about-item">Jonathan H. Redwine</div>
              <div className="about__main__info-about-tagline about-item">
                A software developer with a passion for building things
              </div>
              <div className="about__main__info-about-description">
                I live in Weymouth, Massachusetts with my wife and son. In my free time I enjoy spending time with my
                family and friends, golfing, and reading. I'm always open to working on exciting projects, so please
                reach out if you have something in mind!
              </div>
            </div>
            <div className="about__main__info-contact">
              <button className="about__main__info-contact-btn" onClick={() => this.props.scrollToBottom()}>
                Get in touch with me
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
