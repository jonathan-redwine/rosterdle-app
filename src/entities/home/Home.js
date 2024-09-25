import React, { useEffect, useState } from 'react';
import './Home.scss';
import { ENTITIES } from '../../constants/entities';

const Home = props => {
  const todayUserDailyGame = props.userDailyGames.find(dailyGame => dailyGame.gameDate === props.today);

  const [showArchive, setShowArchive] = useState(false);
  const [dailyGameArchiveList, setDailyGameArchiveList] = useState([]);

  const getTodaysGameClass = () => {
    if (!todayUserDailyGame) return '';
    else if (!todayUserDailyGame.gameComplete) return '';
    else if (todayUserDailyGame.gameWon) return 'green-game';
    else return 'red-game';
  };

  const getTodaysGameSubtitle = () => {
    if (!todayUserDailyGame) return `Play today's game!`;
    const numGuesses = todayUserDailyGame.guesses.split(',').length;
    if (!todayUserDailyGame.gameComplete)
      return `You've made ${numGuesses} guess${numGuesses > 1 ? 'es' : ''}. Continue playing!`;
    else if (todayUserDailyGame.gameWon) return `You solved it in ${numGuesses} guess${numGuesses > 1 ? 'es' : ''}!`;
    else return `Try again tomorrow!`;
  };

  const getArchivedDailyGameClasses = archivedDailyGame => {
    if (!archivedDailyGame.gameComplete) return '';
    if (archivedDailyGame.gameWon) return 'game-won';
    return 'game-lost';
  };

  const getArchivedDailyGameMessage = archivedDailyGame => {
    const numGuesses = archivedDailyGame.guesses?.split(',').length;
    // No guesses
    if (!numGuesses) return '';
    // Game not complete
    if (!archivedDailyGame.gameComplete)
      return `Keep playing! You've submitted ${numGuesses} guess${numGuesses > 1 ? 'es' : ''}!`;
    // Game won
    if (archivedDailyGame.gameWon) return `You solved it in ${numGuesses} guess${numGuesses > 1 ? 'es' : ''}!`;
    // Game lost
    return `You lost this one!`;
  };

  const showGameArchive = () => {
    setShowArchive(true);
  };

  const hideGameArchive = () => {
    setShowArchive(false);
  };

  useEffect(() => {
    let targetPlayers = props.targetPlayers.filter(
      targetPlayer => new Date(targetPlayer.date) <= new Date(props.today)
    );
    targetPlayers.sort((a, b) => new Date(b.date) - new Date(a.date));
    targetPlayers = targetPlayers.map(targetPlayer => {
      const userDailyGame = props.userDailyGames.find(dailyGame => dailyGame.gameDate === targetPlayer.date) || {};
      return {
        ...targetPlayer,
        gameComplete: userDailyGame.gameComplete,
        gameWon: userDailyGame.gameWon,
        guesses: userDailyGame.guesses,
      };
    });
    setDailyGameArchiveList(targetPlayers);
  }, [props.targetPlayers, props.userDailyGames, props.today]);

  return showArchive ? (
    <div className="home">
      <div className="archive">
        <div className="archive__back">
          <span className="archive__back-btn" onClick={hideGameArchive}>
            BACK
          </span>
        </div>
        <div className="archive__games">
          <div className="archive__games-header">DAILY GAME ARCHIVE</div>
          <div className="archive__games-list">
            {dailyGameArchiveList.map((dailyGame, index) => (
              <div
                key={index}
                className={`archive__games-list__game ${getArchivedDailyGameClasses(dailyGame)}`}
                onClick={() => props.dailyGameClicked(dailyGame)}
              >
                <div className="archive__games-list__game-info-item date">{dailyGame.date}</div>
                <div className="archive__games-list_-game-info-item">
                  {dailyGame.gameComplete ? dailyGame.name : ''}
                </div>
                <div className="archive__games-list__game-info-item">{getArchivedDailyGameMessage(dailyGame)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="home">
      <div className="home__header">
        <div className="home__header-title">Welcome to Rosterdle!</div>
        <div className="home__header-subtitle">The game about who played with who</div>
      </div>
      <div className="game-mode">
        <div className="game-mode__title">STANDARD MODE</div>
        <div className="game-mode__games-container">
          <div
            className={`game-mode__games-container__game ${getTodaysGameClass()}`}
            onClick={() => props.dailyGameClicked({ date: props.today })}
          >
            <div className="game-mode__games-container__game-title">Today's Game ({props.today})</div>
            <div className="game-mode__games-container__game-subtitle">{getTodaysGameSubtitle()}</div>
          </div>
          <div className="game-mode__games-container__game blue-game" onClick={showGameArchive}>
            <div className="game-mode__games-container__game-title">Game Archive</div>
          </div>
        </div>
      </div>
      <div className="game-mode">
        <div className="game-mode__title">BATTLE MODE</div>
        <div className="game-mode__games-container">
          <div
            className="game-mode__games-container__game black-game"
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
