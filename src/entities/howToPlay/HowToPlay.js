import React, { createRef, useState } from 'react';
import './HowToPlay.scss';
import mlbTeams from '../../data/mlb_teams.json';
import allPlayers from '../../data/all_players.json';
import UnknownPlayer from '../../assets/unknown_player.png';
import MannyRamirez from '../../assets/manny_ramirez.jpg';
import GregMaddux from '../../assets/greg_maddux.jpg';
import JasonGiambi from '../../assets/jason_giambi.jpg';
import BattleMode from '../../assets/battlemode.png';
import PlayerSubmission from '../../components/PlayerSubmission/PlayerSubmission';
import Timer from '../../components/Timer/Timer';
import { getSharedTeams, consolidateTeams } from '../../helpers/dataHelper';

const HowToPlay = () => {
  const [isFlipped, setFlipped] = useState([false, false]);

  const handleFlip = i => {
    setFlipped(isFlipped.map((f, index) => (i === index ? !f : f)));
  };

  let mookieBetts = {
    ...allPlayers.find(player => player.name === 'Mookie Betts'),
    allTeams: consolidateTeams(getSharedTeams('Mookie Betts', '', mlbTeams)),
  };

  let rafaelDevers = {
    ...allPlayers.find(player => player.name === 'Rafael Devers'),
    allTeams: consolidateTeams(getSharedTeams('Rafael Devers', '', mlbTeams)),
    sharedTeams: getSharedTeams('Rafael Devers', 'Mookie Betts', mlbTeams).map(team => `${team.year} ${team.name}`),
  };

  const timerRef = createRef();
  const timerExpired = () => timerRef.current.resetTimer();

  return (
    <div className="how-to-play">
      <div className="how-to-play__container">
        {/* Daily Game */}
        <div className={`flip-card green ${isFlipped[0] ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className="card-content">
                <div className="card-content__front-title">Standard Mode</div>
                <img className="card-content__front-image" src={UnknownPlayer} alt="Standard Mode"></img>
                <div className="card-content__front-description">Guess the player of the day!</div>
              </div>
              <button className="flip-button" onClick={() => handleFlip(0)}>
                Learn the Rules
              </button>
            </div>
            <div className="flip-card-back">
              <div className="card-content">
                <div className="card-content__title">Standard Mode</div>
                <div className="card-content__rules-container">
                  <div className="card-content__rules-container__rule">
                    The goal of the game is to guess the unknown player.
                  </div>
                  <div className="card-content__rules-container__rule">
                    <img src={UnknownPlayer} alt="Unknown Player"></img>
                  </div>
                  <div className="card-content__rules-container__rule">
                    To start, you will be shown images of three players that the unknown player played with at some
                    point in their career.
                  </div>
                  <div className="card-content__rules-container__rule">
                    <img src={MannyRamirez} alt="Manny Ramirez"></img>
                    <img src={GregMaddux} alt="Greg Maddux"></img>
                    <img src={JasonGiambi} alt="Jason Giambi"></img>
                  </div>
                  <div className="card-content__rules-container__rule" style={{ fontSize: '10pt' }}>
                    Note that these players' uniforms may not be a team they shared with the unknown player!
                  </div>
                  <div className="card-content__rules-container__rule">
                    With each incorrect guess, additional hints will be given:
                  </div>
                  <div
                    className="card-content__rules-container__rule left-justify"
                    style={{ marginLeft: '10%', marginRight: '10%' }}
                  >
                    <div className="list-item">1 - Names of the unknown player's teammates</div>
                    <div className="list-item">
                      2 - The teams that the first teammate shared with the unknown player
                    </div>
                    <div className="list-item">
                      3 - The teams that the second teammate shared with the unknown player
                    </div>
                    <div className="list-item">
                      4 - The teams that the third teammate shared with the unknown player
                    </div>
                    <div className="list-item">5 - The unknown player's position(s)</div>
                  </div>
                  <div className="card-content__rules-container__rule">
                    After 6 incorrect guesses, the game is over and the unknown player will be revealed.
                  </div>
                  <div className="card-content__rules-container__rule">
                    <button className="flip-button" onClick={() => handleFlip(0)}>
                      Got it!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Battle Mode */}
        <div className={`flip-card red ${isFlipped[1] ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <div className="card-content">
                <div className="card-content__front-title">Battle Mode</div>
                <img className="card-content__front-image" src={BattleMode} alt="Battle Mode"></img>
                <div className="card-content__front-description">
                  Play head-to-head against another user, naming players who have played together until someone is
                  stumped!
                </div>
              </div>
              <button className="flip-button" onClick={() => handleFlip(1)}>
                Learn the Rules
              </button>
            </div>
            <div className="flip-card-back">
              <div className="card-content">
                <div className="card-content__title">Battle Mode</div>
                <div className="card-content__rules-container">
                  <div className="card-content__rules-container__rule">
                    Challenge another user to a head-to-head battle!
                  </div>
                  <div className="card-content__rules-container__rule">
                    To start, a random currently active player will be submitted to begin the game. The teams that the
                    submitted player have played on will be displayed.
                  </div>
                  <div className="card-content__rules-container__rule">
                    <PlayerSubmission
                      playersSubmitted={[mookieBetts]}
                      player={mookieBetts}
                      index={0}
                      exampleMode={true}
                    ></PlayerSubmission>
                  </div>
                  <div className="card-content__rules-container__rule">
                    Either you or your opponent will be selected to go first.
                  </div>
                  <div className="card-content__rules-container__rule">
                    When it is your turn, you must submit a player who, at some point in their career, was a teammate of
                    the previously submitted player.
                  </div>
                  <div className="card-content__rules-container__rule">
                    If a valid player is submitted, that player will be displayed along with the teams they shared with
                    the previously submitted player. It is then the other user's turn.
                  </div>
                  <div className="card-content__rules-container__rule" style={{ flexDirection: 'column' }}>
                    <PlayerSubmission
                      playersSubmitted={[mookieBetts, rafaelDevers]}
                      player={rafaelDevers}
                      index={1}
                      exampleMode={true}
                    ></PlayerSubmission>
                    <PlayerSubmission
                      playersSubmitted={[mookieBetts, rafaelDevers]}
                      player={mookieBetts}
                      index={0}
                      exampleMode={true}
                    ></PlayerSubmission>
                  </div>
                  <div className="card-content__rules-container__rule">
                    Players may only be submitted once, and you don't have all day!
                  </div>
                  <div className="card-content__rules-container__rule">
                    <Timer timerExpired={timerExpired} timerMaxSeconds={20} gameIsLive={true} ref={timerRef}></Timer>
                  </div>
                  <div className="card-content__rules-container__rule">
                    The game ends when you or your opponent cannot name a teammate of the current player and the timer
                    expires.
                  </div>
                  <div className="card-content__rules-container__rule">
                    <button className="flip-button" onClick={() => handleFlip(1)}>
                      Got it!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
