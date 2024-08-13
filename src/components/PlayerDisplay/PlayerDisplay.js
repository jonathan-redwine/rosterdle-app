import React, { Component } from 'react';
import './PlayerDisplay.scss';

class PlayerDisplay extends Component {
  generatePlayerPicPath(playerId) {
    return `player_pics/${playerId}.jpg`;
  }

  render() {
    return (
      <div className="player">
        <img className="player__pic" src={`${this.generatePlayerPicPath(this.props.player.id)}`} alt="MLB Player" />
        <div className="player__name">{this.props.gameRound >= 2 ? this.props.player.name : ''}</div>
        <div className="player__shared-teams">
          {this.props.gameRound >= this.props.sharedTeamsRevealRound
            ? this.props.player.sharedTeams.map((value, index) => {
                return (
                  <div className="player__shared-teams__team" key={index}>
                    {value}
                  </div>
                );
              })
            : ''}
        </div>
      </div>
    );
  }
}

export default PlayerDisplay;
