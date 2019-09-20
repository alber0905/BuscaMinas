const Combinatorics = require('js-combinatorics');

function numberCombination(numberArray: number[]): number[] {
  const baseN = Combinatorics.baseN(numberArray, 6).toArray()[0] as number[];
  return baseN;
}
