import React, { Component } from 'react';
import './Battle.scss';
import allPlayers from '../../data/all_players.json';
import mlbTeams from '../../data/mlb_teams.json';
import { MODES } from './battle-constants';
import socketIO from 'socket.io-client';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import Timer from '../../components/Timer/Timer';
import { randomCurrentPlayer, getSharedTeams, consolidateTeams } from '../../helpers/dataHelper';
import { generateRandomGuestName } from '../../helpers/guestNameHelper';

class Battle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMode: MODES.HOME,
      player: '',
      playersSubmitted: [],
      timerRef: React.createRef(),
      gameIsLive: false,
    };
    this.joinLobby = this.joinLobby.bind(this);
    this.handlePlayerInputChange = this.handlePlayerInputChange.bind(this);
    this.onNewPlayerGuess = this.onNewPlayerGuess.bind(this);
    this.timerExpired = this.timerExpired.bind(this);
    this.calculatePlayerSubmissionTop = this.calculatePlayerSubmissionTop.bind(this);
  }

  componentDidMount() {
    if (this.state.socket) return;
    const socket = socketIO.connect('http://localhost:4000');

    socket.on('connectionSuccessful', numPlaying => {
      this.setState({ numUsersPlaying: numPlaying });
    });

    socket.on('foundGame', gameData => {
      this.setState({
        currentMode: MODES.IN_GAME,
        gameId: gameData.gameId,
        opponent: gameData.opponent,
        yourMove: gameData.yourMove,
        gameIsLive: true,
      });

      // If first move, initialize game with a player
      if (gameData.yourMove) {
        const player = randomCurrentPlayer(allPlayers);
        this.state.socket.emit('submitPlayer', { player, gameId: gameData.gameId });
        this.setState({
          player: '',
        });
      }
    });

    socket.on('playerSubmitted', submission => {
      this.setState({
        playersSubmitted: [
          ...this.state.playersSubmitted,
          {
            ...submission.player,
            allTeams: consolidateTeams(getSharedTeams(submission.player.name, '', mlbTeams)),
          },
        ],
        yourMove: submission.yourMove,
      });
      this.state.timerRef.current.resetTimer();
    });

    socket.on('gameWon', data => {
      console.log(`You won!`);
    });

    socket.on('gameLost', data => {
      console.log(`You lost!`);
    });

    this.setState({ socket: socket });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  joinLobby() {
    const username = generateRandomGuestName();
    this.state.socket.emit('enterLobby', username);

    this.setState({
      username: username,
      currentMode: MODES.IN_LOBBY,
    });
  }

  handlePlayerInputChange(e) {
    this.setState({
      player: e.target.value,
    });
  }

  onNewPlayerGuess(player) {
    const sharedTeams = getSharedTeams(this.state.playersSubmitted.slice(-1)[0].name, player.name, mlbTeams).map(
      team => `${team.year} ${team.name}`
    );
    if (sharedTeams.length) {
      this.state.socket.emit('submitPlayer', {
        player: {
          ...player,
          sharedTeams,
        },
        gameId: this.state.gameId,
      });
    } else {
      // emit a bad guess event
    }
  }

  timerExpired() {
    this.setState({ gameIsLive: false });
    this.state.yourMove && this.state.socket.emit('timerExpired', { gameId: this.state.gameId });
  }

  calculatePlayerSubmissionTop(i) {
    const step = 200;
    const offset = 40;
    return `${(this.state.playersSubmitted.length - i - 1) * step + offset}px`;
  }

  render() {
    return <div className="battle">{this.getActiveMode()}</div>;
  }

  getActiveMode = () => {
    switch (this.state.currentMode) {
      case MODES.HOME: {
        return (
          <div className="battle__home">
            <div className="battle__home__title">Welcome to battle mode!</div>
            <div>
              {this.state.numUsersPlaying} user{this.state.numUsersPlaying === 1 ? ' is' : 's are'} playing!
            </div>
            <div className="battle__home__play-btn" onClick={this.joinLobby}>
              Play!
            </div>
          </div>
        );
      }
      case MODES.IN_LOBBY: {
        return (
          <div className="battle__lobby">
            <div>Searching for game...</div>
          </div>
        );
      }
      case MODES.IN_GAME: {
        return (
          <div className="battle__game">
            <div className="battle__game-title">
              The {this.state.username} vs. the {this.state.opponent}
            </div>
            <div>
              <Timer
                timerMaxSeconds={20}
                timerExpired={this.timerExpired}
                gameIsLive={this.state.gameIsLive}
                ref={this.state.timerRef}
              ></Timer>
            </div>
            <div className="battle__game-container">
              <div className="battle__game-container__player-search-container">
                <PlayerSearch
                  onNewPlayerGuess={this.onNewPlayerGuess}
                  disabled={!this.state.yourMove}
                  disallowedPlayers={this.state.playersSubmitted.map(player => player.name)}
                ></PlayerSearch>
              </div>
              <div className="battle__game-container__player-submissions">
                {this.state.playersSubmitted.map((player, index) => {
                  return (
                    <div
                      className="battle__game-container__player-submissions__player "
                      key={index}
                      style={{ top: this.calculatePlayerSubmissionTop(index) }}
                    >
                      <div
                        className={`battle__game-container__player-submissions__player__box ${
                          index < this.state.playersSubmitted.length - 1 ? 'connected-player' : ''
                        }`}
                      >
                        <div className="battle__game-container__player-submissions__player__box__name">
                          {player.name}
                        </div>
                        <div className="battle__game-container__player-submissions__player__box__all-teams">
                          {player.allTeams.map((teamName, index) => {
                            return <div key={index}>{teamName}</div>;
                          })}
                        </div>
                      </div>
                      {index > 0 && (
                        <div className="battle__game-container__player-submissions__player__connection">
                          {player.sharedTeams.map((teamName, index) => {
                            return (
                              <div
                                className="battle__game-container__player-submissions__player__connection-team"
                                key={index}
                              >
                                {teamName}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      default: {
        return <span>Strange game state</span>;
      }
    }
  };
}

export default Battle;
