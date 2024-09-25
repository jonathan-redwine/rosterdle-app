import Cookies from 'universal-cookie';

const USER_COOKIE_NAME = 'user';
const GAMES_COOKIE_NAME = 'games';

export const getUserCookie = () => {
  const cookies = new Cookies();
  return cookies.get(USER_COOKIE_NAME);
};

export const setUserCookie = cookie => {
  const cookies = new Cookies();
  cookies.set(USER_COOKIE_NAME, cookie);
};

export const deleteUserCookie = () => {
  const cookies = new Cookies();
  cookies.remove(USER_COOKIE_NAME);
};

export const getUserDailyGames = today => {
  const cookies = new Cookies();
  const userDailyGames = cookies.get(GAMES_COOKIE_NAME) || {};
  return Object.keys(userDailyGames).map(date => ({
    ...(userDailyGames[date] || {}),
    gameDate: date,
  }));
};

export const setUserDailyGame = newGuess => {
  const cookies = new Cookies();
  const userGameCookie = cookies.get(GAMES_COOKIE_NAME) || {};
  if (Object.keys(userGameCookie).includes(newGuess.date)) {
    userGameCookie[newGuess.date].guesses = `${userGameCookie[newGuess.date].guesses},${newGuess.player}`;
    userGameCookie[newGuess.date].gameWon = newGuess.gameWon;
    userGameCookie[newGuess.date].gameComplete = newGuess.gameComplete;
  } else {
    userGameCookie[newGuess.date] = {};
    userGameCookie[newGuess.date].guesses = `${newGuess.player}`;
    userGameCookie[newGuess.date].gameWon = newGuess.gameWon;
    userGameCookie[newGuess.date].gameComplete = newGuess.gameComplete;
  }
  cookies.set(GAMES_COOKIE_NAME, userGameCookie);
};
