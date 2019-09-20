import out from '../../util/out';
import {
  endingWords,
  checkRae,
  getBestWord,
  askRae,
  getLongestWord,
  processMatch,
} from '../../letters/utils/index';

test('checking words ends', (): void => {
  const res = endingWords('sdjfiofs');

  expect(res).toBe(false);
});

/* test('trying play letters', (): void => {
  const letters = ['a', 'c', 'e', 'i', 't', 'e', 'n', 'u', 'a'];
  const res = getBestWord(letters);
  out.info('Guessed word', res);
  expect(res.length).toBeGreaterThan(0);
}); */

test('ask Rae a word', async (): Promise<void> => {
  const word = 'aceituna';
  const resIsWord = await askRae(word);
  out.info(`is on Rae ${word}`);
  expect(resIsWord).toBe(true);
});

test('ask Rae a familiar word', async (): Promise<void> => {
  const word = 'amiga';
  const resIsWord = await askRae(word);
  out.info(`is on Rae ${word}`);
  expect(resIsWord).toBe(false);
});

test('ask Rae a mumblejumble', async (): Promise<void> => {
  const word = 'hfkdsb';
  const resIsWord = await askRae(word);
  out.info(`is NOT on Rae ${word}`);
  expect(resIsWord).toBe(false);
});

test('process Rae answer gender', (): void => {
  const answer = 'amigo, ga.';
  const res = processMatch(answer);
  out.info(`Matches ${JSON.stringify(res)}`);
  expect(res[0]).toBe('amigo');
  expect(res[1]).toBe('amiga');
});

/* test('process Rae answer multiple matches', (): void => {
  const answer = 'amigo, ga.';
  const res = processMatch(answer);
  out.info(`Matches ${JSON.stringify(res)}`);
  expect(res[0]).toBe('amigo');
  expect(res[1]).toBe('amiga');
}); */
