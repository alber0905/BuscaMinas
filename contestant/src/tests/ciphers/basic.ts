import { allCombinationsOperations } from '../../ciphers/index';
import out from '../../util/out';

test('checking all operations', (): void => {
  const res: string[] = allCombinationsOperations();
  out.info(`FIRST OPERATION ==> ${res[0]}`);
  expect(res).toBe([3]);
});
