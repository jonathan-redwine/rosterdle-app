import React, { Component } from 'react';
import './Game.scss';
import PlayerDisplay from '../../components/PlayerDisplay/PlayerDisplay';
import PlayerGuess from '../../components/PlayerGuess/PlayerGuess';
import PlayerSearchResult from '../../components/PlayerSearchResult/PlayerSearchResult';
import targetPlayers from '../../data/target_players.json';
import mlbTeams from '../../data/mlb_teams.json';
import allPlayers from '../../data/all_players.json';
import {
  constructFullTargetPlayer,
  getTeammates,
  handlePlayerGuess,
  executePlayerSearch,
} from '../../helpers/dataHelper';

class Game extends Component {
  constructor(props) {
    super(props);
    const targetPlayer = constructFullTargetPlayer(targetPlayers[2].name, mlbTeams, allPlayers);
    this.state = {
      targetPlayer,
      teammates: getTeammates(targetPlayer, targetPlayers[2].teammates, allPlayers),
      guessInput: '',
      gameRound: 1,
      playerGuesses: [],
      searchResult: [],
      showSearchResult: false,
    };
    this.handleGuessInputChange = this.handleGuessInputChange.bind(this);
    this.handleGuessInputFocusIn = this.handleGuessInputFocusIn.bind(this);
    this.handleGuessInputBlur = this.handleGuessInputBlur.bind(this);
    this.handleSubmitGuess = this.handleSubmitGuess.bind(this);
    this.calculatePlayerGuessMargin = this.calculatePlayerGuessMargin.bind(this);
    this.isGuessCorrect = this.isGuessCorrect.bind(this);
  }

  handleGuessInputChange(e) {
    const searchText = e.target.value;
    this.setState({
      guessInput: searchText,
      searchResult: searchText.length > 0 ? executePlayerSearch(searchText, allPlayers) : [],
    });
  }

  handleGuessInputFocusIn() {
    this.setState({ showSearchResult: true });
  }

  handleGuessInputBlur() {
    setTimeout(() => {
      this.setState({ showSearchResult: false });
    }, 100); // Force async (1/10th of a second) to allow a guess submit event to occur
  }

  handleSubmitGuess(playerName) {
    let newPlayerGuess = handlePlayerGuess(playerName, this.state.teammates, mlbTeams);
    newPlayerGuess = {
      ...newPlayerGuess,
      correct: this.isGuessCorrect(newPlayerGuess.teammates, this.state.teammates),
    };
    this.setState({
      gameRound: this.state.gameRound + 1,
      playerGuesses: [...this.state.playerGuesses, newPlayerGuess],
      searchResult: [],
      guessInput: '',
    });

    if (newPlayerGuess.correct) {
      this.handleGameWin();
    }
  }

  handleGameWin() {
    this.setState({
      gameRound: 100,
    });
  }

  calculatePlayerGuessMargin(i) {
    const step = 70;
    return `${(this.state.playerGuesses.length - i) * step}px`;
  }

  isGuessCorrect(guessTeammates, targetTeammates) {
    if (!guessTeammates || !targetTeammates) return false;
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

  render() {
    return (
      <div className="game">
        <div className="game-container">
          <div className="game-container__teammates">
            <div className="game-container__teammates-teammate">
              <PlayerDisplay
                player={this.state.teammates[0]}
                sharedTeamsRevealRound={3}
                gameRound={this.state.gameRound}
              ></PlayerDisplay>
            </div>
            <div className="game-container__teammates-teammate">
              <PlayerDisplay
                player={this.state.teammates[1]}
                sharedTeamsRevealRound={4}
                gameRound={this.state.gameRound}
              ></PlayerDisplay>
            </div>
            <div className="game-container__teammates-teammate">
              <PlayerDisplay
                player={this.state.teammates[2]}
                sharedTeamsRevealRound={5}
                gameRound={this.state.gameRound}
              ></PlayerDisplay>
            </div>
          </div>
          <div className="game-container__guesses">
            <div className="game-container__guesses__guess">
              <input
                type="text"
                value={this.state.guessInput}
                onChange={this.handleGuessInputChange}
                onFocus={this.handleGuessInputFocusIn}
                onBlur={this.handleGuessInputBlur}
              />
            </div>
            {this.state.showSearchResult &&
              this.state.searchResult.slice(0, 10).map((player, index) => {
                return (
                  <PlayerSearchResult
                    key={index}
                    player={player}
                    index={index}
                    handleSubmitGuess={this.handleSubmitGuess}
                  ></PlayerSearchResult>
                );
              })}
            {this.state.playerGuesses.map((playerGuess, index) => {
              return (
                <div
                  className={
                    this.isGuessCorrect(playerGuess.teammates, this.state.teammates)
                      ? 'game-container__guesses__guess correct-guess'
                      : 'game-container__guesses__guess'
                  }
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
    );
  }
}

export default Game;
