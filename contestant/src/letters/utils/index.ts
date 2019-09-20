import Combinatorics from 'js-combinatorics';
import allWords from /* 'https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/palabras.json'; // */ './allWords';
import out from '../../util/out';

export function getBestWord(arr: string[]): string {
  if (arr.length <= 9) {
    const combinations = combine(arr);
    if (combinations.length > 0) {
      const allowedWords = checkRae(combinations);
      const word = getLongestWord(allowedWords);
      return word;
    }
  }
  return '';
}

export function combine(letters: string[]): string[] {
  const maxSize = 8; // probar con todos hasta 9, empezar por 9
  for (let size = maxSize; size >= 1; size -= 1) {
    const combArr = Combinatorics.combination(letters, size);
    if (combArr) {
      const arr: string[] = [];
      combArr.forEach((letters: string[]) => arr.push(letters.join()));
      return arr;
    }
  }
  return [];
}

export function endingWords(word: string): boolean {
  const forbiddenEndings = ['me', 'te', 'se'];
  const lastLetter = word.substring(word.length - 1);
  const twoLastLetters = word.substring(word.length - 2);
  if (lastLetter !== 's' && forbiddenEndings.indexOf(twoLastLetters) === -1) {
    return true;
  }
  return false;
}

export function checkRae(arr: string[]): string[] {
  const allowedWords: string[] = [];
  for (let i = 0, l = arr.length; i < l; i += 1) {
    const word = arr[i];
    if (askRae(word) && endingWords(word)) {
      allowedWords.push(word);
    }
  }
  return allowedWords;
}

export function askRae(word: string): boolean {
  return !!allWords.find(word);
}

export function getLongestWord(arr: string[]): string {
  if (arr.length > 0) {
    const orderedArr = arr.sort().reverse();
    return orderedArr[0];
  }
  return '';
}

export default {
  getLongestWord,
  getBestWord,
  combine,
  askRae,
};
