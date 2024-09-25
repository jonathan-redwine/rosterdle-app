export const constructFullTargetPlayer = (playerName, mlbTeams, allPlayers) => {
  const teams = mlbTeams.filter(t => t.roster.find(p => p.includes(playerName)));
  const player = allPlayers.find(p => p.name === playerName);
  return {
    id: player.id,
    name: playerName,
    teams,
    numbers: player.numbers
      .map(number => parseInt(number.replace('#', '')))
      .filter(number => !isNaN(number))
      .sort((a, b) => a - b),
    positions: player.positions,
  };
};

export const getTeammates = (targetPlayer, teammates, allPlayers) => {
  return teammates.map(teammateName => {
    const sharedTeams = getSharedTeams(targetPlayer.name, teammateName, targetPlayer.teams).sort();
    const teammate = {
      id: allPlayers.find(p => p.name === teammateName).id,
      name: teammateName,
      sharedTeams,
    };
    return teammate;
  });
};

export const handlePlayerGuess = (guessPlayer, teammates, mlbTeams, allPlayers) => {
  const player = allPlayers.find(p => p.name === guessPlayer);
  return {
    name: guessPlayer,
    teammates: teammates.map(teammate => {
      const sharedTeams = getSharedTeams(teammate.name, guessPlayer, mlbTeams);
      return {
        name: teammate.name,
        sharedTeams,
      };
    }),
    numbers: player.numbers
      .map(number => parseInt(number.replace('#', '')))
      .filter(number => !isNaN(number))
      .sort((a, b) => a - b),
    positions: player.positions,
  };
};

export const getSharedTeams = (firstPlayerName, secondPlayerName, teams) => {
  return teams.filter(
    t => t.roster.find(p => p.includes(firstPlayerName)) && t.roster.find(p => p.includes(secondPlayerName))
  );
};

export const consolidateTeams = teams => {
  const getEarliestTeam = (teams, currTeamName, currMinYear) => {
    const sameTeamSameYear = teams.find(team => team.year === currMinYear && team.name === currTeamName);
    return sameTeamSameYear
      ? sameTeamSameYear
      : teams.reduce((prev, curr) => {
          return prev.year < curr.year ? prev : curr;
        });
  };

  let teamsRemaining = [...teams];
  let consolidatedTeams = [];
  let currTeamName = '';
  let currMinYear = 0;
  let currMaxYear;
  while (teamsRemaining.length > 0) {
    const earliestTeam = getEarliestTeam(teamsRemaining, currTeamName, currMinYear);
    currTeamName = earliestTeam.name;
    currMinYear = earliestTeam.year;
    currMaxYear = earliestTeam.year;
    teamsRemaining = teamsRemaining.filter(t => !(t.name === earliestTeam.name && t.year === earliestTeam.year));
    let nextTeam = teamsRemaining.length
      ? teamsRemaining.reduce((prev, curr) => {
          return prev.year < curr.year ? prev : curr;
        })
      : { name: '' };
    while (nextTeam.name === currTeamName) {
      let thisTeam = nextTeam;
      currMaxYear = thisTeam.year;
      teamsRemaining = teamsRemaining.filter(t => !(t.name === thisTeam.name && t.year === thisTeam.year));
      nextTeam = teamsRemaining.length
        ? teamsRemaining.reduce((prev, curr) => {
            return prev.year < curr.year ? prev : curr;
          })
        : { name: '' };
    }
    consolidatedTeams.push(
      currMinYear === currMaxYear ? `${currMinYear} ${currTeamName}` : `${currMinYear}-${currMaxYear} ${currTeamName}`
    );
  }
  return consolidatedTeams;
};

export const playersWhoWereTeammates = (teammateNames, mlbTeams, allPlayers) => {
  if (teammateNames.length === 0) return [];

  let players = [];
  mlbTeams
    .filter(t => t.roster.find(p => p.includes(teammateNames[0])))
    .forEach(t => {
      t.roster.forEach(p => {
        const playerName = allPlayers.find(player => p.includes(player.name));
        if (!players.includes(playerName)) players.push(playerName);
      });
    });

  for (let i = 1; i < teammateNames.length; i++) {
    let thesePlayers = [];
    mlbTeams
      .filter(t => t.roster.find(p => p.includes(teammateNames[i])))
      .forEach(t => {
        t.roster.forEach(p => {
          const playerName = allPlayers.find(player => p.includes(player.name));
          if (!thesePlayers.includes(playerName)) thesePlayers.push(playerName);
        });
      });
    players = players.filter(p => thesePlayers.includes(p));
  }

  return players;
};

export const executePlayerSearch = (searchText, allPlayers) => {
  const sortAlphabetically = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };
  return allPlayers
    .filter(player => player.name.toUpperCase().includes(searchText.toUpperCase()))
    .sort(sortAlphabetically);
};

export const randomCurrentPlayer = allPlayers => {
  const currentYear = new Date().getUTCFullYear();
  const currentPlayers = allPlayers.filter(player => player.lastYear === currentYear);
  return currentPlayers[Math.floor(Math.random() * currentPlayers.length)];
};
