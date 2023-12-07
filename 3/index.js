const fs = require("fs");
const isASymbol = (char) => (char ? /[^\d|\.]/.test(char) : false);
const isAdjacentToSymbol = (prunedLines, numberStr, numberStrIndex) => {
  let prev, current, next;
  if (prunedLines.length === 1) {
    current = prunedLines[0];
  } else if (prunedLines.length === 2) {
    prev = prunedLines[0];
    current = prunedLines[1];
  } else {
    prev = prunedLines[0];
    current = prunedLines[1];
    next = prunedLines[2];
  }

  const [min, max] = [numberStrIndex - 1, numberStrIndex + numberStr.length];
  for (let i = min; i <= max; i++) {
    if (isASymbol(prev?.[i]) || isASymbol(next?.[i]) || isASymbol(current[i]))
      return true;
  }
  return false;
};

const getLines = () =>
  fs
    .readFileSync("./input.txt", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);

const getAdjacentNumbers = () => {
  const lines = getLines();
  return lines.reduce((acc, line, lineIndex, lines) => {
    const numbersAndPositions = [...line.matchAll(/\d+/g)];
    numbersAndPositions.forEach((numberIterator) => {
      const numberStr = numberIterator[0];
      const numberStrIndex = numberIterator.index;
      const prevLineIndex = lineIndex - 1 >= 0 ? lineIndex - 1 : 0;
      const nextLineIndex = lineIndex + 2;
      const isAdjacent = isAdjacentToSymbol(
        lines.slice(prevLineIndex, nextLineIndex),
        numberStr,
        numberStrIndex,
      );

      if (isAdjacent) {
        acc.push(numberStr);
      }
    });

    return acc;
  }, []);
};

const getAdjacentNumbersSum = () => {
  const adjacentNumbers = getAdjacentNumbers();
  return adjacentNumbers.reduce((a, b) => a + Number.parseInt(b), 0);
};
// =================================================================
const getTrackedNumber = (digitMatcher, line) => {
  let digits = [digitMatcher[0][0]];

  let forwardIndex = digitMatcher.index + 1;
  let backwardIndex = digitMatcher.index - 1;
  let skipForward;
  let skipBackward;
  while (
    (backwardIndex >= 0 && !skipBackward) ||
    (!skipForward && forwardIndex < line.length)
  ) {
    if (/\d/.test(line[backwardIndex])) {
      digits = [line[backwardIndex], ...digits];
      backwardIndex--;
    } else {
      skipBackward = true;
    }

    if (/\d/.test(line[forwardIndex])) {
      digits = [...digits, line[forwardIndex]];
      forwardIndex++;
    } else {
      skipForward = true;
    }
  }

  return digits.join("");
};

const buildCustomMatcher = (nativeMatcher, index) => {
  const match = [nativeMatcher[0][0]];
  match.index = index;
  return match;
};
const getSurroundingDigitsMatchers = (line, index) => {
  if (!line) return [];
  const matchers = [];
  const prev = [...line[index - 1]?.matchAll(/\d/g)];
  const current = [...line[index]?.matchAll(/\d/g)];
  const next = [...line[index + 1]?.matchAll(/\d/g)];

  if (current.length) {
    matchers.push(buildCustomMatcher(current, index));
    return matchers;
  }
  if (prev.length) matchers.push(buildCustomMatcher(prev, index - 1));
  if (next.length) matchers.push(buildCustomMatcher(next, index + 1));
  return matchers;
};

const getAdjacentNumbersByMultiplier = (
  prunedLines,
  multiplicationSignIndex,
) => {
  let numbers = [];
  let prev, current, next;
  if (prunedLines.length === 1) {
    current = prunedLines[0];
  } else if (prunedLines.length === 2) {
    prev = prunedLines[0];
    current = prunedLines[1];
  } else {
    prev = prunedLines[0];
    current = prunedLines[1];
    next = prunedLines[2];
  }

  const previousNumberIndex = getSurroundingDigitsMatchers(
    prev,
    multiplicationSignIndex,
  );
  const currentNumberIndex = getSurroundingDigitsMatchers(
    current,
    multiplicationSignIndex,
  );
  const nextNumberIndex = getSurroundingDigitsMatchers(
    next,
    multiplicationSignIndex,
  );

  if (previousNumberIndex.length) {
    numbers = [
      ...numbers,
      ...previousNumberIndex.map((nIdx) => getTrackedNumber(nIdx, prev)),
    ];
  }

  if (currentNumberIndex.length) {
    numbers = [
      ...numbers,
      ...currentNumberIndex.map((nIdx) => getTrackedNumber(nIdx, current)),
    ];
  }

  if (nextNumberIndex.length) {
    numbers = [
      ...numbers,
      ...nextNumberIndex.map((nIdx) => getTrackedNumber(nIdx, next)),
    ];
  }

  if (numbers.length > 2) return [];

  return [numbers];
};

const getMultipliedNumbers = () => {
  const lines = getLines();
  const multiplierNumbers = lines.reduce((acc, line, lineIndex, lines) => {
    const multiplicationSignsAndIndexes = [...line.matchAll(/\*/g)];
    if (multiplicationSignsAndIndexes.length === 0) return acc;
    multiplicationSignsAndIndexes.forEach((multiplicationIterator) => {
      const multiplicationSignIndex = multiplicationIterator.index;
      const prevLineIndex = lineIndex - 1 >= 0 ? lineIndex - 1 : 0;
      const nextLineIndex = lineIndex + 2;
      const prunedLines = lines.slice(prevLineIndex, nextLineIndex);
      const adjacentNumbers = getAdjacentNumbersByMultiplier(
        prunedLines,
        multiplicationSignIndex,
      );
      acc = [...acc, ...adjacentNumbers];
    });

    return acc;
  }, []);
  const numberTuples = multiplierNumbers
    .filter((maybeTuple) => maybeTuple.length === 2)
    .reduce(
      (acc, tuple) => (acc += tuple.reduce((a, b) => (a *= parseInt(b)))),
      0,
    );
  return numberTuples;
};

console.log(getAdjacentNumbersSum());
console.log(getMultipliedNumbers());
