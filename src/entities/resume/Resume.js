import React, { Component } from 'react';
import './Resume.scss';
import MyResume from '../../assets/jonathanredwine.pdf';
import Alert from '../../assets/alert.png';

class Resume extends Component {
  render() {
    return (
      <div className="resume">
        <object
          data={MyResume}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ minHeight: '90vh' }}
          name="Jonathan Redwine Resume"
        >
          <div className="bad-load">
            <div>
              <img src={Alert} alt="instagram" className="media-btn"></img>
            </div>
            <div>Something appears to have gone wrong loading my resume.</div>
            <div>
              To learn more about my skills and professional experience, please visit my{' '}
              <a href="https://www.linkedin.com/in/jonathan-redwine-168300ab/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              !
            </div>
          </div>
        </object>
      </div>
    );
  }
}

export default Resume;
