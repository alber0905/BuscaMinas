import Combinatorics from 'js-combinatorics';

// function combination(elementArray: string[] | number[], iterations: number): string[][] | number[][] {
//     const result: string[][] | number[][] = [];
//     for (let i = 1; i <= iterations; i++) {
//         const accum: string[][] | number[][] = Combinatorics.baseN(elementArray, i).toArray();
//         result.push(...accum);
//         console.log('OPERATIONS ==> ', i, result);
//       }
//   return result;
// }

interface fn {
  (a: number, b: number): number;
}

export function allCombinationsOperations(): fn[][] {
  const suma = (a: number, b: number) => a + b;
  const resta = (a: number, b: number) => a - b;
  const mult = (a: number, b: number) => a * b;
  const div = (a: number, b: number) => a % b;

  const operators = [suma, resta, mult, div];
  const operations: fn[][] = [];

  for (let i = 1; i <= 5; i++) {
    const iteration = Combinatorics.baseN(operators, i).toArray();
    operations.push(...iteration);
  }
  //   console.log('OPERATIONS ==> ', operations);
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const isNotValid =
      op.every(item => item.name === 'resta') ||
      op.every(item => item.name === 'div');
    if (isNotValid) {
      console.log('OPERATOR TO REMOVE ==> ', op);
      operations.splice(i, 1);
    }
  }
  return operations;
}

export function numbersCombination(numberArray: number[]): number[][] {
  const numbersCombinations: number[][] = [];
  for (let i = 2; i <= numberArray.length; i++) {
    const iteration: number[][] = Combinatorics.baseN(numberArray, i).toArray();
    numbersCombinations.push(...iteration);
  }
  return numbersCombinations;
}

export function allOperations(
  ciphers: number[][],
  operators: fn[][],
  expectedResult: number[],
): number {
  for (let i = 0; i < ciphers.length; i++) {
    const ciphersGrouped = ciphers.filter(c => c.length === i);
    const operatorsGrouped = operators.filter(o => o.length === i - 1);
    for (let j = 0; i < ciphersGrouped.length; j++) {
      const numbers = ciphersGrouped[i];
      for (let k = 0; k < operatorsGrouped.length; k++) {
        let result: number = 0;
        const operator = operators[k];
        result += operator(numbers[i], numbers[i + 1]);
      }
    }
  }
}
