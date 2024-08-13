import React, { Component } from 'react';
import { Tooltip, Button, ClickAwayListener } from '@mui/material';
import './PlayerGuess.scss';

class PlayerGuess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
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

  identicalSharedTeams() {
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

  getTeammateClass(teammate) {
    if (this.isCorrectGuess()) return '';
    if (this.identicalSharedTeams()) return 'all-shared-teams';
    return teammate.sharedTeams.length ? 'some-shared-teams' : 'no-shared-teams';
  }

  handleTooltipOpen(e, i) {
    //console.log(`opening ${i}`);
    this.setState({ tooltipOpen: true });
  }

  handleTooltipClose(e, i) {
    //console.log(`${i}: ${this.state.tooltipOpen}`);
    //if (this.state.tooltipOpen) this.setState({ tooltipOpen: false });
  }

  getTooltipText() {
    let missingTeams = [];
    let i = 0;
    this.props.targetTeammates.forEach(t => {
      t.sharedTeams.forEach(st => {
        t.sharedTeams.forEach(st => {
          if (!this.props.guess.teammates[i].sharedTeams.includes(st)) {
            missingTeams.push(st);
          }
        });
      });
      i++;
    });
    return `These players played together, but the guess is missing having played on the following teams: ${missingTeams.join(
      ', '
    )}`;
  }

  render() {
    return (
      <div className="player-guess">
        <span className="player-guess__name">{this.props.guess.name}</span>
        {this.props.guess.teammates.map((teammate, index) => {
          return (
            <ClickAwayListener onClickAway={e => this.handleTooltipClose(e, index)} key={index}>
              <div className="player-guess__teammate">
                {teammate.sharedTeams.length && !this.identicalSharedTeams() ? (
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    title={this.getTooltipText()}
                    placement="top"
                    onClose={() => this.handleTooltipClose()}
                    open={this.state.tooltipOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                  >
                    <Button
                      sx={{ ml: 6, textTransform: 'capitalize' }}
                      onClick={(e, index) => this.handleTooltipOpen(e, index)}
                    >
                      <span className={this.getTeammateClass(teammate)}>{teammate.name}</span>
                    </Button>
                  </Tooltip>
                ) : (
                  <span className={this.getTeammateClass(teammate)}>{teammate.name}</span>
                )}
              </div>
            </ClickAwayListener>
          );
        })}
      </div>
    );
  }
}

export default PlayerGuess;
