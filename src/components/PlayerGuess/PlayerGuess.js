import React, { Component } from 'react';
import { Tooltip, Button, ClickAwayListener } from '@mui/material';
import './PlayerGuess.scss';
import { consolidateTeams } from '../../helpers/dataHelper';

class PlayerGuess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: {
        0: false,
        1: false,
        2: false,
      },
    };
    this.isCorrectGuess = this.isCorrectGuess.bind(this);
    this.getTeammateClass = this.getTeammateClass.bind(this);
    this.identicalSharedTeams = this.identicalSharedTeams.bind(this);
    this.handleTooltipOpen = this.handleTooltipOpen.bind(this);
    this.handleTooltipClose = this.handleTooltipClose.bind(this);
    this.getTooltipText = this.getTooltipText.bind(this);
  }

  isCorrectGuess() {
    return this.props.guess.correct;
  }

  allIdenticalSharedTeams() {
    let i = 0;
    let numSharedTeams = 0;
    let totalSharedTeams = 0;
    this.props.targetTeammates.forEach(t => {
      totalSharedTeams += t.sharedTeams.length;
      t.sharedTeams.forEach(st => {
        totalSharedTeams += t.sharedTeams.length;
        t.sharedTeams.forEach(st => {
          numSharedTeams += this.props.guess.teammates[i].sharedTeams.includes(st) ? 1 : 0;
        });
      });
      i++;
    });
    return numSharedTeams === totalSharedTeams;
  }

  identicalSharedTeams(i) {
    let numSharedTeams = 0;
    const thisTeammate = this.props.targetTeammates[i];
    thisTeammate.sharedTeams.forEach(st => {
      numSharedTeams += this.props.guess.teammates[i].sharedTeams.includes(st) ? 1 : 0;
    });
    return numSharedTeams === thisTeammate.sharedTeams.length;
  }

  getTeammateClass(teammate, i) {
    if (this.isCorrectGuess()) return 'correct-guess';
    if (this.identicalSharedTeams(i)) return 'all-shared-teams';
    return teammate.sharedTeams.length ? 'some-shared-teams' : 'no-shared-teams';
  }

  handleTooltipOpen(i) {
    let newTooltipOpenState = { ...this.state.tooltipOpen };
    newTooltipOpenState[i] = true;
    this.setState({ tooltipOpen: newTooltipOpenState });
  }

  handleTooltipClose(i) {
    let newTooltipOpenState = { ...this.state.tooltipOpen };
    newTooltipOpenState[i] = false;
    this.setState({ tooltipOpen: newTooltipOpenState });
  }

  getTooltipText(i) {
    const thisTeammate = this.props.targetTeammates[i];
    if (!this.props.guess.teammates[i].sharedTeams.length)
      return `${this.props.guess.name} and ${thisTeammate.name} never played together.`;
    if (!this.identicalSharedTeams(i)) {
      let missingTeams = [];
      thisTeammate.sharedTeams.forEach(st => {
        if (!this.props.guess.teammates[i].sharedTeams.includes(st)) {
          missingTeams.push(st);
        }
      });
      return `${this.props.guess.name} played with ${
        thisTeammate.name
      }, but he is missing having played on the following listed team(s): ${consolidateTeams(missingTeams).join(
        ', '
      )}.`;
    }
    return `${this.props.guess.name} played with ${
      thisTeammate.name
    } on all of today's listed team(s): ${consolidateTeams(thisTeammate.sharedTeams).join(', ')}.`;
  }

  render() {
    return this.props.guess.name.length ? (
      <div className="player-guess">
        <div className="player-guess__name">{`${this.props.guess.name} (${this.props.guess.positions.join(
          ', '
        )})`}</div>
        {this.props.guess.teammates.map((teammate, index) => {
          return (
            <ClickAwayListener onClickAway={() => this.handleTooltipClose(index)} key={index}>
              <div className="player-guess__teammate">
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  title={this.getTooltipText(index)}
                  placement="top"
                  onClose={() => this.handleTooltipClose()}
                  open={this.state.tooltipOpen[index]}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                >
                  <Button
                    sx={{ textTransform: 'capitalize', fontFamily: 'Oswald' }}
                    onClick={() => this.handleTooltipOpen(index)}
                  >
                    <span className={this.getTeammateClass(teammate, index)}>{teammate.name}</span>
                  </Button>
                </Tooltip>
              </div>
            </ClickAwayListener>
          );
        })}
      </div>
    ) : (
      'PASSED'
    );
  }
}

export default PlayerGuess;
