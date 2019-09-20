import Combinatorics from 'js-combinatorics';

export function allCombinationsOperations(): string[] {
  const operators = ['+', '-', '*', '%'];
  const operations: string[] = [];

  for (let i = 2; i <= 5; i++) {
    const iteration: string[] = Combinatorics.baseN(operators, i).toArray()[0];
    operations.concat(...iteration);
  }
  return operations;
}

export function numberCombination(numberArray: number[]): number[] {
  const baseN = Combinatorics.baseN(numberArray, 3).toArray()[0] as number[];

  return baseN;
}
