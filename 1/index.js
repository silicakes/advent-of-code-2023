const fs = require("fs");
const getLines = (path) => {
  return fs.readFileSync(path, { encoding: "utf8" }).split("\n");
};

const getCalibrationValue = (initialValues) =>
  initialValues.reduce((acc, tuple) => {
    if (tuple.length === 1) tuple[1] = tuple[0];

    const total = tuple.reduce((a, b) => a + b);
    acc += parseInt(total);
    return acc;
  }, 0);

const calculateNumericValue = () => {
  const blines = getLines("./input.txt");
  const lines = getLines("./input.txt").slice(0, blines.length - 1);
  const initialValues = lines.reduce((acc, line) => {
    const lineTuple = line.split("").reduce((charAcc, char) => {
      const isCharNumber = !isNaN(char);
      if (isCharNumber) {
        if (charAcc[0]) {
          charAcc[1] = char;
        } else {
          charAcc[0] = char;
        }
      }
      return charAcc;
    }, []);
    acc.push(lineTuple);
    return acc;
  }, []);

  const calibrationValue = getCalibrationValue(initialValues);
  return calibrationValue;
};

const calculateAlphaNumericValue = () => {
  const blines = getLines("./input.txt");
  const lines = blines.slice(0, blines.length - 1);
  const alphaToDigits = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const getAlphaDigit = (line) => {
    const alphaDigits = Object.keys(alphaToDigits);
    for (const alphaDigit of alphaDigits) {
      if (line.startsWith(alphaDigit)) return alphaDigit;
    }
  };

  const getAlphaLineTuple = (line) => {
    const tuple = [];
    let i = 0;
    while (i < line.length) {
      const prunedLine = line.slice(i, line.length);
      const firstChar = prunedLine[0];
      const isNumber = !isNaN(firstChar);
      if (isNumber) {
        if (tuple[0]) {
          tuple[1] = firstChar;
        } else {
          tuple[0] = firstChar;
        }
      } else {
        const alphaDigit = getAlphaDigit(prunedLine);
        if (alphaDigit) {
          const digit = alphaToDigits[alphaDigit];
          if (tuple[0]) {
            tuple[1] = digit;
          } else {
            tuple[0] = digit;
          }
        }
      }
      i++;
    }

    return tuple;
  };

  const initialValues = lines.reduce((acc, line) => {
    const lineTuple = getAlphaLineTuple(line);
    acc.push(lineTuple);
    return acc;
  }, []);

  const calibrationValue = getCalibrationValue(initialValues);
  return calibrationValue;
};

console.log(calculateNumericValue());
console.log(calculateAlphaNumericValue());
