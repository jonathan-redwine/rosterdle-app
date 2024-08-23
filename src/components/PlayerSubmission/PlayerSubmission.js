import React, { useEffect, useState } from 'react';
import './PlayerSubmission.scss';

const PlayerSubmission = props => {
  const [imageSource, setImageSource] = useState(``);

  const calculatePlayerSubmissionTop = i => {
    if (props.exampleMode) return `0px`;
    const step = 350;
    const offset = 40;
    return `${(props.playersSubmitted.length - i - 1) * step + offset}px`;
  };

  const getSubmittedByClasses = () => {
    return `player-submission__box__submittedBy ${props.thisUserSubmitted ? 'left' : 'right'}`;
  };

  const teamsToString = teams => {
    if (teams.length === 1) return teams[0];
    if (teams.length === 2) return `${teams[0]} and ${teams[1]}`;
    let sharedTeams = '';
    teams.forEach((team, i) => {
      if (i === 0) {
        sharedTeams = `${team}`;
      } else {
        const joiner = i === teams.length - 1 ? ', and ' : ', ';
        sharedTeams = `${sharedTeams}${joiner}${team}`;
      }
    });
    return sharedTeams;
  };

  const generatePlayerPicPath = playerId => {
    return `player_pics/${playerId}.jpg`;
  };

  const unknownPlayerPicPath = () => {
    return `player_pics/unknown.png`;
  };

  const setDefaultImageSource = () => {
    setImageSource(unknownPlayerPicPath());
  };

  useEffect(() => {
    setImageSource(generatePlayerPicPath(props.player.id));
  }, [props.player.id]);

  return (
    <div className="player-submission" key={props.index} style={{ top: calculatePlayerSubmissionTop(props.index) }}>
      {/* Player Box */}
      <div
        className={`player-submission__box ${
          props.index < props.playersSubmitted.length - 1 ? 'connected-player' : ''
        }`}
      >
        <div className={getSubmittedByClasses()}>{props.player.submittedBy}</div>
        <div className="player-submission__box__picture">
          <img src={imageSource} alt={`player-${props.player.id}`} onError={setDefaultImageSource}></img>
        </div>
        <div className="player-submission__box__info">
          <div className="player-submission__box__info-name">{props.player.name}</div>
          <div className="player-submission__box__info-all-teams">{teamsToString(props.player.allTeams)}</div>
        </div>
      </div>
      {/* Player Connection */}
      {props.index > 0 && (
        <div className="player-submission__connection">
          <div className="player-submission__connection__teams-container">
            <div className="player-submission__connection__teams-container__teams">
              {teamsToString(props.player.sharedTeams)}
            </div>
          </div>
          <div className="player-submission__connection__line"></div>
        </div>
      )}
    </div>
  );
};

export default PlayerSubmission;
