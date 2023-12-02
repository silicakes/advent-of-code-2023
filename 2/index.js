const fs = require("fs");

const getGameData = () => {
  const lines = fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  const gameDictionary = lines.map((line) => {
    const [idLocation, restLine] = line.split(":");
    const id = Number.parseInt(idLocation.match(/\d/g).join(""));
    const games = restLine.split(";").map((game) => {
      const configuration = game.split(",").map((c) => c.trim());
      const configMap = configuration.map((c) => {
        const [value, color] = c.split(" ");
        return { color, value: Number.parseInt(value) };
      });
      return configMap;
    });
    return { id, games };
  });
  return gameDictionary;
};

const constraints = {
  red: 12,
  green: 13,
  blue: 14,
};

const isPossibleRound = (round, constraints) => {
  return round.games.every((turn) =>
    turn.every(({ color, value }) => {
      return value <= constraints[color];
    }),
  );
};

const countPossibleResults = (constraints) => {
  const gameData = getGameData();
  const impossibleGames = gameData.filter((round) => {
    return isPossibleRound(round, constraints);
  });

  // console.dir(impossibleGames.slice(0, 1), { depth: Infinity });
  return impossibleGames.reduce((acc, { id }) => {
    return acc + id;
  }, 0);
};

const getPowerList = (gameData) => {
  return gameData.map((round) => {
    return round.games.reduce(
      (acc, turn) => {
        turn.forEach(({ color, value }) => {
          if (acc[color] < value) {
            acc[color] = value;
          }
        });

        return acc;
      },
      { red: 0, green: 0, blue: 0 },
    );
  });
};

const getSumOfPower = () => {
  const gameData = getGameData();
  const powerList = getPowerList(gameData);
  return powerList.reduce(
    (acc, { red, green, blue }) => (acc += red * green * blue),
    0,
  );
};

console.log(countPossibleResults(constraints));
console.log(getSumOfPower());
