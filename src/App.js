import React, { Component } from 'react';
import './App.scss';
import { ClipLoader } from 'react-spinners';
import socketIO from 'socket.io-client';
import { ENTITIES } from './constants/entities';
import SideBar from './components/SideBar/SideBar';
import Home from './entities/home/Home';
import Game from './entities/game/Game';
import Battle from './entities/battle/Battle';
import HowToPlay from './entities/howToPlay/HowToPlay';
import Login from './entities/login/Login';
import PageNotFound from './components/PageNotFound/PageNotFound';
import { getUserCookie, getUserDailyGames } from './helpers/cookieHelper';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loadedUser: false,
      loadedUserDailyGames: false,
      loadedDailyGameTargets: false,
      activeEntity: ENTITIES.HOME,
    };
    this.entitySelected = this.entitySelected.bind(this);
    this.onUserLogin = this.onUserLogin.bind(this);
    this.onUserLogout = this.onUserLogout.bind(this);
    this.onUpdateUserPreferences = this.onUpdateUserPreferences.bind(this);
    this.syncUserDailyGame = this.syncUserDailyGame.bind(this);
    this.dailyGameClicked = this.dailyGameClicked.bind(this);
  }

  // Look for user info in cookies and connect to socket server
  componentDidMount() {
    const userCookie = getUserCookie();

    if (this.state.socket) return;

    console.log(`Connecting to ${process.env.REACT_APP_SOCKET_API_LOCATION}`);
    const socket = socketIO.connect(process.env.REACT_APP_SOCKET_API_LOCATION);

    // When connected to socket server, get user data if user is logged in
    socket.on('connectionSuccessful', () => {
      socket.emit('getDailyGameTargets');
      if (userCookie) {
        socket.emit('getUser', userCookie);
      } else {
        const userDailyGames = getUserDailyGames();
        this.setState({ loadedUser: true, loadedUserDailyGames: true, userDailyGames });
      }
    });

    // Save user data to state
    socket.on('userData', userData => {
      socket.emit('getUserDailyGames', userData.id);
      this.setState({ user: userData, loadedUser: true });
    });

    // Save user daily games to state
    socket.on('userDailyGames', userDailyGames => {
      this.setState({ userDailyGames, loadedUserDailyGames: true });
    });

    // Save daily game targets to state
    socket.on('dailyGameTargets', dailyGameTargets => {
      this.setState({ dailyGameTargets, loadedDailyGameTargets: true });
    });

    this.setState({ socket });

    const todaysDate = new Date();
    const today =
      (todaysDate.getMonth() > 8 ? todaysDate.getMonth() + 1 : '0' + (todaysDate.getMonth() + 1)) +
      '/' +
      (todaysDate.getDate() > 9 ? todaysDate.getDate() : '0' + todaysDate.getDate()) +
      '/' +
      todaysDate.getFullYear();
    this.setState({ today, gameDate: today });
  }

  onUserLogin(user) {
    this.state.socket.emit('getUser', user);
  }

  onUserLogout() {
    this.setState({ user: null, userDailyGames: null });
  }

  onUpdateUserPreferences(userPreferences) {
    this.setState({
      user: {
        ...this.state.user,
        prefAdjective: userPreferences.adjective,
        prefNoun: userPreferences.noun,
      },
    });
  }

  syncUserDailyGame(gameData) {
    if (!gameData.guesses.length) return;
    let userDailyGames = [...this.state.userDailyGames];
    const index = this.state.userDailyGames.findIndex(userDailyGame => userDailyGame.gameDate === gameData.date);
    if (index < 0) {
      userDailyGames.push({
        guesses: gameData.guesses.map(guess => guess.name).join(','),
        gameComplete: gameData.gameComplete,
        gameWon: gameData.gameWon,
        gameDate: gameData.date,
      });
    } else {
      let userDailyGame = { ...userDailyGames[index] };
      userDailyGame.guesses = gameData.guesses.map(guess => guess.name).join(',');
      userDailyGame.gameComplete = gameData.gameComplete;
      userDailyGame.gameWon = gameData.gameWon;
      userDailyGames[index] = userDailyGame;
    }
    this.setState({ userDailyGames });
  }

  dailyGameClicked(dailyGame) {
    this.setState({ gameDate: dailyGame.date, activeEntity: ENTITIES.GAME });
  }

  entitySelected(entity) {
    this.setState({ activeEntity: entity });
  }

  getActiveEntity() {
    switch (this.state.activeEntity) {
      case ENTITIES.HOME: {
        return (
          <Home
            user={this.state.user}
            userDailyGames={this.state.userDailyGames}
            targetPlayers={this.state.dailyGameTargets}
            dailyGameClicked={this.dailyGameClicked}
            today={this.state.today}
            entitySelected={this.entitySelected}
          ></Home>
        );
      }
      case ENTITIES.GAME: {
        return (
          <Game
            user={this.state.user}
            userDailyGames={this.state.userDailyGames}
            socket={this.state.socket}
            targetPlayers={this.state.dailyGameTargets}
            date={this.state.gameDate}
            syncUserDailyGame={this.syncUserDailyGame}
          ></Game>
        );
      }
      case ENTITIES.BATTLE: {
        return <Battle user={this.state.user} socket={this.state.socket} entitySelected={this.entitySelected}></Battle>;
      }
      case ENTITIES.HOW_TO_PLAY: {
        return <HowToPlay user={this.state.user}></HowToPlay>;
      }
      case ENTITIES.LOGIN: {
        return (
          <Login
            user={this.state.user}
            socket={this.state.socket}
            onUserLogin={this.onUserLogin}
            onUserLogout={this.onUserLogout}
            onUpdateUserPreferences={this.onUpdateUserPreferences}
          ></Login>
        );
      }
      default: {
        return <PageNotFound user={this.state.user} entitySelected={this.entitySelected}></PageNotFound>;
      }
    }
  }

  render() {
    return (
      <div className="App">
        <SideBar user={this.state.user} entitySelected={this.entitySelected}></SideBar>
        {this.state.loadedUser && this.state.loadedUserDailyGames && this.state.loadedDailyGameTargets ? (
          this.getActiveEntity()
        ) : (
          <div className="user-loading">
            <ClipLoader className="user-loading__spinner" speedMultiplier={0.75}></ClipLoader>
          </div>
        )}
      </div>
    );
  }
}

export default App;
