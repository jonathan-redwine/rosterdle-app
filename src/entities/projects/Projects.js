import React, { Component } from 'react';
import './Projects.scss';
import FreeLunchLogo from '../../assets/freelunch.png';

class Projects extends Component {
  render() {
    return (
      <div className="projects">
        <div className="projects__summary">
          <div className="projects__summary-title">Projects</div>
          <div className="projects__summary-description">
            Some of the projects I've recently worked on. To see more, check out my{' '}
            <a href="https://github.com/redwine168" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </div>
        </div>
        <div className="projects__list">
          {/* Free Lunch */}
          <div className="projects__list-item">
            <div className="projects__list-item__title">
              <img src={FreeLunchLogo} alt="Free Lunch Fantasy Sports" />
              <div className="projects__list-item__title-name">Fantasy Football League and Trade Simulator</div>
            </div>
            <div className="projects__list-item__info">
              <div className="projects__list-item__info-description">
                This fantasy football simulation tool allows users to import their fantasy football leagues and simulate
                the rest of the season. The tool takes into account the league's settings, rosters, and matchups to
                determine every team's most likely record. Users can then simulate trades between teams, enabling them
                to identify mutually beneficial trades to improve the outlook for both teams.
              </div>
              <a
                className="projects__list-item__info-link"
                href="https://freelunchfantasy.azurewebsites.net/"
                target="_blank"
                rel="noreferrer"
              >
                Try it out!
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;
