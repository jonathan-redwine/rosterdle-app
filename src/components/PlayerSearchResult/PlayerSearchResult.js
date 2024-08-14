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
    const offset = 20;
    return `${step * (i + 1) + offset}px`;
  }

  render() {
    return (
      <div
        className="player-search-result"
        style={{ marginTop: this.calculatePlayerSearchResultMargin(this.props.index) }}
      >
        <div className="player-search-result__name">
          <span className={`${this.props.disallowed ? 'disallowed' : ''}`}>{this.props.player.name}</span>
          <span className="player-search-result__name__years">
            {this.props.player.firstYear} - {this.props.player.lastYear}
          </span>
        </div>
        <div
          className={`player-search-result__submit ${this.props.disallowed ? 'disallowed-btn' : ''}`}
          onClick={() => !this.props.disallowed && this.props.handleSubmitGuess(this.props.player)}
        >
          Submit
        </div>
      </div>
    );
  }
}

export default PlayerSearchResult;
