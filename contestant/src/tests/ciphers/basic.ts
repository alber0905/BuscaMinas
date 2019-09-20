import {
  allCombinationsOperations,
  numbersCombination,
} from '../../ciphers/index';
import out from '../../util/out';

test('checking all operations', (): void => {
  const res: string[][] = allCombinationsOperations();
  out.info(`RES LENGTH ==> ${res.length}`);

  expect(res.length).toBe(1364);
});

test('check array of numbers', (): void => {
  const arr = [75, 3, 100, 25, 8, 10];
  const result: number[][] = numbersCombination(arr);
  out.info(`RES LENGTH ==> ${result.length}`);
  expect(result).toBeDefined();
});
