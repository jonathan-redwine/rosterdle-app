import React, { Component } from 'react';
import './Game.scss';
import { Modal, Box, Typography } from '@mui/material';
import UnknownPlayer from '../../assets/unknown_player.png';
import PlayerDisplay from '../../components/PlayerDisplay/PlayerDisplay';
import PlayerGuess from '../../components/PlayerGuess/PlayerGuess';
import PlayerSearch from '../../components/PlayerSearch/PlayerSearch';
import mlbTeams from '../../data/mlb_teams.json';
import allPlayers from '../../data/all_players.json';
import { constructFullTargetPlayer, getTeammates, handlePlayerGuess } from '../../helpers/dataHelper';
import { gameOverModalStyle, getGameOverMessage, getGameOverTitle } from '../../helpers/gameEndHelper';
import { setUserDailyGame } from '../../helpers/cookieHelper';

class Game extends Component {
  constructor(props) {
    super(props);
    const todaysTargetPlayer = props.targetPlayers.find(targetPlayer => targetPlayer.date === props.date);
    const targetPlayer = constructFullTargetPlayer(todaysTargetPlayer.name, mlbTeams, allPlayers);
    this.state = {
      socket: this.props.socket,
      targetPlayer,
      teammates: getTeammates(targetPlayer, todaysTargetPlayer.teammates.split(','), allPlayers),
      guessInput: '',
      gameRound: 1,
      gameWon: false,
      gameOver: false,
      gameOverModalOpen: false,
      playerGuesses: [],
      loadedUserDailyGame: false,
      style: gameOverModalStyle,
    };
    this.calculatePlayerGuessMargin = this.calculatePlayerGuessMargin.bind(this);
    this.isGuessCorrect = this.isGuessCorrect.bind(this);
    this.getPlayerGuessClasses = this.getPlayerGuessClasses.bind(this);
    this.onNewPlayerGuess = this.onNewPlayerGuess.bind(this);
    this.onPassGuess = this.onPassGuess.bind(this);
    this.closeGameOverModal = this.closeGameOverModal.bind(this);
  }

  // Attach socket events specific for Game mode
  componentDidMount() {
    this.processUserDailyGame(this.props.userDailyGames, this.props.date);
  }

  componentWillUnmount() {
    this.props.syncUserDailyGame({
      date: this.props.date,
      guesses: this.state.playerGuesses,
      gameComplete: this.state.gameOver,
      gameWon: this.state.gameWon,
    });
  }

  processUserDailyGame(userDailyGames, date) {
    const userDailyGame = userDailyGames.find(dailyGame => dailyGame.gameDate === date);
    if (userDailyGame) {
      const guesses = userDailyGame.guesses.split(',');
      let playerGuesses = [];
      let gameRound = 1;
      guesses.forEach(guess => {
        if (guess.length) {
          let newPlayerGuess = handlePlayerGuess(guess, this.state.teammates, mlbTeams, allPlayers);
          newPlayerGuess = {
            ...newPlayerGuess,
            correct: this.isGuessCorrect(newPlayerGuess.teammates, this.state.teammates),
          };
          playerGuesses.push(newPlayerGuess);
        } else {
          playerGuesses.push({
            name: '',
            teammates: [],
            numbers: [],
            positions: [],
          });
        }
        gameRound++;
      });
      this.setState({
        playerGuesses,
        gameRound: userDailyGame.gameComplete ? 100 : gameRound,
      });
      if (userDailyGame.gameComplete) {
        userDailyGame.gameWon ? this.handleGameWin() : this.handleGameLoss();
      }
    }
  }

  handleGameWin() {
    this.setState({
      gameRound: 100,
      gameOver: true,
      gameOverModalOpen: true,
      gameWon: true,
    });
    if (this.props.user)
      this.props.socket.emit('dailyGameOver', {
        userId: this.props.user.id,
        date: this.props.date,
        gameWon: true,
      });
  }

  handleGameLoss() {
    this.setState({
      gameRound: 100,
      gameOver: true,
      gameOverModalOpen: true,
    });
    if (this.props.user)
      this.props.socket.emit('dailyGameOver', {
        userId: this.props.user.id,
        date: this.props.date,
        gameWon: false,
      });
  }

  closeGameOverModal() {
    this.setState({
      gameOverModalOpen: false,
    });
  }

  calculatePlayerGuessMargin(i) {
    const offset = 10;
    const step = 70;
    return `${offset + (this.state.playerGuesses.length - i - 1) * step}px`;
  }

  getPlayerGuessClasses(playerGuess, targetTeammates) {
    if (!playerGuess.name.length) return 'game-container__guess-container__guesses__guess passed-guess';
    return this.isGuessCorrect(playerGuess.teammates, targetTeammates)
      ? 'game-container__guess-container__guesses__guess correct-guess'
      : 'game-container__guess-container__guesses__guess';
  }

  isGuessCorrect(guessTeammates, targetTeammates) {
    if (!(guessTeammates || []).length || !(targetTeammates || []).length) return false;
    let i = 0;
    let numSharedTeams = 0;
    let totalSharedTeams = 0;
    targetTeammates.forEach(t => {
      totalSharedTeams += t.sharedTeams.length;
      t.sharedTeams.forEach(st => {
        numSharedTeams += guessTeammates[i].sharedTeams.includes(st) ? 1 : 0;
      });
      i++;
    });
    return numSharedTeams === totalSharedTeams;
  }

  onNewPlayerGuess(player) {
    let newPlayerGuess = handlePlayerGuess(player.name, this.state.teammates, mlbTeams, allPlayers);
    newPlayerGuess = {
      ...newPlayerGuess,
      correct: this.isGuessCorrect(newPlayerGuess.teammates, this.state.teammates),
    };
    this.setState({
      gameRound: this.state.gameRound + 1,
      playerGuesses: [...this.state.playerGuesses, newPlayerGuess],
    });

    let gameWon, gameComplete;
    if (newPlayerGuess.correct) {
      this.handleGameWin();
      gameWon = true;
      gameComplete = true;
    } else if (this.state.gameRound >= 7) {
      this.handleGameLoss();
      gameWon = false;
      gameComplete = true;
    }

    if (this.props.user) {
      this.props.socket.emit('guessSubmitted', {
        userId: this.props.user.id,
        player: newPlayerGuess.name,
        today: this.props.date,
      });
    } else {
      setUserDailyGame({
        player: newPlayerGuess.name,
        date: this.props.date,
        gameComplete,
        gameWon,
      });
    }
  }

  onPassGuess() {
    if (this.state.gameOver) return;
    this.setState({
      gameRound: this.state.gameRound + 1,
      playerGuesses: [
        ...this.state.playerGuesses,
        {
          name: '',
          teammates: [],
          numbers: [],
          positions: [],
        },
      ],
    });

    let gameWon,
      gameComplete = false;
    if (this.state.gameRound >= 7) {
      this.handleGameLoss();
      gameComplete = true;
    }

    if (this.props.user) {
      this.props.socket.emit('guessSubmitted', {
        userId: this.props.user.id,
        player: '',
        today: this.props.date,
      });
    } else {
      setUserDailyGame({
        player: '',
        date: this.props.date,
        gameComplete,
        gameWon,
      });
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-container">
          <div className="game-container__summary-container">
            <div className="game-container__summary-container__header">
              <div className="game-container__summary-container__header__title">Who played with these players?</div>
              <div className="game-container__summary-container__header__subtitle">
                Which MLB player was teammates with each of these three players on all of the listed teams?
              </div>
            </div>
            <div className="game-container__summary-container__target-player">
              <div className="game-container__summary-container__target-player__name">
                <span>{this.state.gameRound >= 100 ? this.state.targetPlayer.name : ''}</span>
              </div>
              <div className="game-container__summary-container__target-player__info">
                <img
                  src={this.state.gameRound >= 100 ? `player_pics/${this.state.targetPlayer.id}.jpg` : UnknownPlayer}
                  alt="Target Player"
                ></img>
                <div className="game-container__summary-container__target-player__info-item">
                  {`Numbers: ${this.state.gameRound >= 2 ? this.state.targetPlayer.numbers.join(', ') : '???'}`}
                </div>
                <div className="game-container__summary-container__target-player__info-item">
                  {`Positions: ${this.state.gameRound >= 3 ? this.state.targetPlayer.positions.join(', ') : '???'}`}
                </div>
              </div>
            </div>
            <div className="game-container__summary-container__teammates">
              <div className="game-container__summary-container__teammates-teammate">
                <PlayerDisplay
                  player={this.state.teammates[0]}
                  sharedTeamsRevealRound={5}
                  gameRound={this.state.gameRound}
                ></PlayerDisplay>
              </div>
              <div className="game-container__summary-container__teammates-teammate">
                <PlayerDisplay
                  player={this.state.teammates[1]}
                  sharedTeamsRevealRound={6}
                  gameRound={this.state.gameRound}
                ></PlayerDisplay>
              </div>
              <div className="game-container__summary-container__teammates-teammate">
                <PlayerDisplay
                  player={this.state.teammates[2]}
                  sharedTeamsRevealRound={7}
                  gameRound={this.state.gameRound}
                ></PlayerDisplay>
              </div>
            </div>
          </div>
          <div className="game-container__guess-container">
            <div className="game-container__guess-container__guesses">
              <div className="game-container__guess-container__guesses__pass-container">
                <div className="game-container__guess-container__guesses__pass-container__guesses-remaining">
                  GUESSES REMAINING: {7 - this.state.playerGuesses.length}
                </div>
                <div
                  className="game-container__guess-container__guesses__pass-container__pass"
                  onClick={this.onPassGuess}
                >
                  PASS
                </div>
              </div>
              <PlayerSearch
                className="game-container__guess-container__guesses__guess"
                teammates={this.state.teammates}
                onNewPlayerGuess={this.onNewPlayerGuess}
                placeholder={'THANKS FOR PLAYING!'}
                disabled={this.state.gameOver}
                disallowedPlayers={this.state.playerGuesses.map(player => player.name)}
              ></PlayerSearch>
              {this.state.playerGuesses.map((playerGuess, index) => {
                return (
                  <div
                    className={this.getPlayerGuessClasses(playerGuess, this.state.teammates)}
                    key={index}
                    style={{ marginTop: this.calculatePlayerGuessMargin(index) }}
                  >
                    <PlayerGuess guess={playerGuess} targetTeammates={this.state.teammates}></PlayerGuess>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Modal
          open={this.state.gameOverModalOpen}
          onClose={this.closeGameOverModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={this.state.style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {getGameOverTitle(this.state.gameWon, this.state.playerGuesses.length)}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {getGameOverMessage(this.state.gameWon, this.state.playerGuesses.length)}
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default Game;
