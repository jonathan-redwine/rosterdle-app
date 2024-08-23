import React, { Component } from 'react';
import './Battle.scss';
import allPlayers from '../../data/all_players.json';
import mlbTeams from '../../data/mlb_teams.json';
import { MODES } from './battle-constants';
import socketIO from 'socket.io-client';
import { ClipLoader } from 'react-spinners';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import PlayerSubmission from '../../components/PlayerSubmission/PlayerSubmission';
import Timer from '../../components/Timer/Timer';
import BattleMode from '../../assets/battlemode.png';
import { randomCurrentPlayer, getSharedTeams, consolidateTeams } from '../../helpers/dataHelper';
import { generateRandomGuestName } from '../../helpers/guestNameHelper';
import { ENTITIES } from '../../constants/entities';

class Battle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMode: MODES.HOME,
      player: '',
      playersSubmitted: [],
      timerRef: React.createRef(),
      gameIsLive: false,
      gameFinished: false,
      gameWon: false,
      gameOverMessage: '',
      loading: true,
      color: '#ffffff',
    };
    this.joinLobby = this.joinLobby.bind(this);
    this.leaveLobby = this.leaveLobby.bind(this);
    this.handlePlayerInputChange = this.handlePlayerInputChange.bind(this);
    this.onNewPlayerGuess = this.onNewPlayerGuess.bind(this);
    this.timerExpired = this.timerExpired.bind(this);
    this.calculatePlayerSubmissionTop = this.calculatePlayerSubmissionTop.bind(this);
    this.getGameStateClasses = this.getGameStateClasses.bind(this);
    this.getGameStateText = this.getGameStateText.bind(this);
  }

  componentDidMount() {
    if (this.state.socket) return;
    const socket = socketIO.connect('http://localhost:4000');
    this.setState({
      username: generateRandomGuestName(),
    });

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

    socket.on('gameOver', data => {
      this.setState({ gameIsLive: false, gameFinished: true, gameWon: data.gameWon, gameOverMessage: data.message });
    });

    this.setState({ socket: socket });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  joinLobby() {
    this.setState({
      currentMode: MODES.IN_LOBBY,
    });
    setTimeout(() => {
      this.state.socket.emit('enterLobby', this.state.username);
    }, 1000); // Always wait a second in lobby to give illusion of being crowded
  }

  leaveLobby() {
    this.state.socket.emit('leaveLobby');
    this.setState({ currentMode: MODES.HOME });
  }

  handlePlayerInputChange(e) {
    this.setState({
      player: e.target.value,
    });
  }

  onNewPlayerGuess(player) {
    const sharedTeams = getSharedTeams(this.state.playersSubmitted.slice(-1)[0].name, player.name, mlbTeams);
    if (sharedTeams.length) {
      this.state.socket.emit('submitPlayer', {
        player: {
          ...player,
          sharedTeams: consolidateTeams(sharedTeams),
          submittedBy: this.state.username,
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

  getGameStateClasses() {
    let classes = 'battle__game__state';
    // Game live, your move
    if (this.state.gameIsLive && this.state.yourMove) {
      classes = `${classes} green`;
    }
    // Game live, opponent's move
    if (this.state.gameIsLive && !this.state.yourMove) {
      classes = `${classes}`;
    }
    // Game over, you won
    if (this.state.gameFinished && this.state.gameWon) {
      classes = `${classes} green`;
    }
    // Game over, you lost
    if (this.state.gameFinished && !this.state.gameWon) {
      classes = `${classes} red`;
    }
    return classes;
  }

  getGameStateText() {
    // Game live, your move
    if (this.state.gameIsLive && this.state.yourMove) return 'YOUR TURN';
    // Game live, opponent's move
    if (this.state.gameIsLive && !this.state.yourMove) return "OPPONENT'S TURN";
    // Game over, you won
    if (this.state.gameFinished && this.state.gameWon) return 'YOU WON!';
    // Game over, you lost
    if (this.state.gameFinished && !this.state.gameWon) return 'YOU LOST!';
    return 'Starting game...';
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
            <div className="battle__home__header">
              <div className="battle__home__header__title">Battle Mode</div>
              <div
                className="battle__home__header__how-to-play"
                onClick={() => this.props.entitySelected(ENTITIES.HOW_TO_PLAY)}
              >
                HOW TO PLAY
              </div>
            </div>
            <div className="battle__home__subheader">Challenge another user!</div>
            <div className="battle__home__body">
              <div className="battle__home__body-games">
                <div className="battle__home__body-games__username">{this.state.username}: 0-0</div>
                <div className="battle__home__body-games__active">
                  {' '}
                  There {this.state.numUsersPlaying === 1 ? 'is ' : 'are '}
                  {this.state.numUsersPlaying} user{this.state.numUsersPlaying === 1 ? '' : 's'} currently playing!
                  <div className="battle__home__body-games__active__play-btn" onClick={this.joinLobby}>
                    Play!
                  </div>
                </div>
              </div>
              <img src={BattleMode} alt="Battle Mode"></img>
            </div>
          </div>
        );
      }
      case MODES.IN_LOBBY: {
        return (
          <div className="battle__lobby">
            <div className="battle__lobby__message">SEARCHING FOR GAME...</div>
            <ClipLoader className="battle__lobby__loading-spinner" speedMultiplier={0.75}></ClipLoader>
            <div className="battle__lobby__leave">
              Tired of waiting? Click <span onClick={this.leaveLobby}>here</span> to go back.
            </div>
          </div>
        );
      }
      case MODES.IN_GAME: {
        return (
          <div className="battle__game">
            <div className="battle__game__jumbotron">
              <div className="battle__game__jumbotron-username user">{this.state.username}</div>
              <Timer
                timerMaxSeconds={20}
                timerExpired={this.timerExpired}
                gameIsLive={this.state.gameIsLive}
                ref={this.state.timerRef}
              ></Timer>
              <div className="battle__game__jumbotron-username opponent">{this.state.opponent}</div>
            </div>
            <div className={this.getGameStateClasses()}>
              {`${this.state.gameOverMessage}${this.state.gameOverMessage.length ? ' - ' : ''}`}
              {this.getGameStateText()}
            </div>
            <div className="battle__game__player-search-container">
              <PlayerSearch
                onNewPlayerGuess={this.onNewPlayerGuess}
                disabled={!(this.state.yourMove && this.state.gameIsLive)}
                disallowedPlayers={this.state.playersSubmitted.map(player => player.name)}
              ></PlayerSearch>
            </div>
            {/* Submitted Players */}
            <div className="battle__game__player-submissions">
              {this.state.playersSubmitted.map((player, index) => {
                return (
                  <PlayerSubmission
                    playersSubmitted={this.state.playersSubmitted}
                    player={player}
                    thisUserSubmitted={player.submittedBy === this.state.username}
                    index={index}
                    key={index}
                  ></PlayerSubmission>
                );
              })}
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
