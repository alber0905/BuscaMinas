const Combinatorics = require('js-combinatorics');

const num = '342';

export function numberCombination(num: string): number[] {
  const arrNumbers = num.split('').map(str => Number(str));
  const baseN = Combinatorics.baseN(arrNumbers, 3);

  return baseN;
}
