import socketList, {Socket} from '../util/connections';
import out from '../util/out';

const vowels = ['a','e','i','o','u'];
const consonants = ['b','c','d','f','g','h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];

const runLetters = async (socket?: Socket): Promise<void> => {
  let sockets: Socket[] = [];

  if (socket) {
    sockets = [socket];
  } else {
    sockets = Object.keys(socketList).map((key): Socket=> socketList[key]);
  }

  const selectedVowels = vowels.sort((): number => Math.random() > 0.5 ? 1 : -1);
  const selectedConsonants= consonants.sort((): number => Math.random() > 0.5 ? 1 : -1);
  const letters = [...selectedVowels.slice(0,4), ...selectedConsonants.slice(0,5)].sort((): number => Math.random() > 0.5 ? 1 : -1);
  const transaction = Math.round(Math.random() * 1000000).toString();
  const message = {
    transaction,
    letters,
  };

  out.info(`Sending letters: ${JSON.stringify(message)}`);

  sockets.forEach((skt): void => {
    skt.emit('letters', message)
  });
};

export default runLetters;
