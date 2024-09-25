import React, { Component } from 'react';
import './PlayerSearch.scss';
import allPlayers from '../../data/all_players.json';
import PlayerSearchResult from '../PlayerSearchResult/PlayerSearchResult';
import { executePlayerSearch } from '../../helpers/dataHelper';

class PlayerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guessInput: '',
      searchResult: [],
      showSearchResult: false,
    };
    this.getInputPlaceholder = this.getInputPlaceholder.bind(this);
    this.handleGuessInputChange = this.handleGuessInputChange.bind(this);
    this.handleGuessInputFocusIn = this.handleGuessInputFocusIn.bind(this);
    this.handleGuessInputBlur = this.handleGuessInputBlur.bind(this);
    this.handleSubmitGuess = this.handleSubmitGuess.bind(this);
  }

  getInputPlaceholder() {
    return this.props.disabled ? this.props.placeholder : 'SUBMIT PLAYER';
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

  handleSubmitGuess(player) {
    this.setState({
      searchResult: [],
      guessInput: '',
    });
    this.props.onNewPlayerGuess(player);
  }

  render() {
    return (
      <div className="player-search">
        <input
          type="text"
          value={this.state.guessInput}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          onChange={this.handleGuessInputChange}
          onFocus={this.handleGuessInputFocusIn}
          onBlur={this.handleGuessInputBlur}
          disabled={this.props.disabled}
          placeholder={this.getInputPlaceholder()}
        />
        <div className="player-search__results-list">
          {this.state.showSearchResult &&
            this.state.searchResult.slice(0, 10).map((player, index) => {
              return (
                <PlayerSearchResult
                  key={index}
                  player={player}
                  index={index}
                  disallowed={this.props.disallowedPlayers.includes(player.name)}
                  handleSubmitGuess={this.handleSubmitGuess}
                ></PlayerSearchResult>
              );
            })}
        </div>
      </div>
    );
  }
}

export default PlayerSearch;
