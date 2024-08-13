import React, { Component } from 'react';
import './PlayerSearchResult.scss';

class PlayerSearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
    };
    this.calculatePlayerSearchResultMargin = this.calculatePlayerSearchResultMargin.bind(this);
  }

  calculatePlayerSearchResultMargin(i) {
    const step = 31;
    return `-${step * (i + 1)}px`;
  }

  render() {
    return (
      <div
        className="player-search-result"
        style={{ marginTop: this.calculatePlayerSearchResultMargin(this.props.index) }}
      >
        <div className="player-search-result__name">{this.props.player.name}</div>
        <div
          className="player-search-result__submit"
          onClick={() => this.props.handleSubmitGuess(this.props.player.name)}
        >
          Submit
        </div>
      </div>
    );
  }
}

export default PlayerSearchResult;
