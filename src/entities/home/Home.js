import React from 'react';
import './Home.scss';
import { ENTITIES } from '../../constants/entities';

const Home = props => {
  const today = new Date();
  const todayDisplay =
    (today.getMonth() > 8 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)) +
    '/' +
    (today.getDate() > 9 ? today.getDate() : '0' + today.getDate()) +
    '/' +
    today.getFullYear();

  return (
    <div className="home">
      <div className="header">Welcome to Rosterdle!</div>
      <div className="game-mode">
        <div className="game-mode__title">STANDARD MODE</div>
        <div className="game-mode__games-container">
          <div
            className="game-mode__games-container__game green-game"
            onClick={() => props.entitySelected(ENTITIES.GAME)}
          >
            <div className="game-mode__games-container__game-title">Today's Game</div>
            <div className="game-mode__games-container__game-subtitle">{todayDisplay}</div>
          </div>
          <div className="game-mode__games-container__game blue-game">
            <div className="game-mode__games-container__game-title">Archive</div>
          </div>
        </div>
      </div>
      <div className="game-mode">
        <div className="game-mode__title">BATTLE MODE</div>
        <div className="game-mode__games-container">
          <div
            className="game-mode__games-container__game red-game"
            onClick={() => props.entitySelected(ENTITIES.BATTLE)}
          >
            <div className="game-mode__games-container__game-title">Challenge another user!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
