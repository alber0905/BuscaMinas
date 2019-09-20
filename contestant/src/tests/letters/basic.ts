import { endingWords, checkRae, getBestWord } from '../../letters/utils/index';

test('checking words ends', (): void => {
  const res = endingWords('sdjfiofs');

  expect(res).toBe(false);
});

test('trying play letters', (): void => {
  const letters = ['a', 'c', 'e', 'i', 't', 'r', 'n', 'u', 'o'];
  const res = getBestWord(letters);
  console.log('Guessed word', res);
  expect(res.length).toBeGreaterThan(0);
});
