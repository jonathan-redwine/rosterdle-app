export const gameOverModalStyle = {
  fontFamily: 'Oswald',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const gameWonTitles = {
  1: ['Holy moly!', 'Wow!'],
  2: ['Well done!'],
  3: ['Nice!'],
  4: ['Solid!'],
  5: ['Got it!'],
  6: ['Tough one!'],
  7: ['Phew!'],
};

const gameLostTitles = ['Dang!', 'Oops!'];

export const getGameOverTitle = (gameWon, numGuesses) => {
  return gameWon
    ? gameWonTitles[numGuesses][Math.floor(Math.random() * gameWonTitles[numGuesses].length)]
    : gameLostTitles[Math.floor(Math.random() * gameLostTitles.length)];
};

export const getGameOverMessage = (gameWon, numGuesses) => {
  return gameWon ? `You got it in ${numGuesses} guess${numGuesses > 1 ? 'es' : ''}!` : "It's okay, it happens";
};
