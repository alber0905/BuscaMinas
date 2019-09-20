import colors from 'colors';
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
  const results: { [id: string]: string } = {};
  const values: { [id: string]: number } = {};
  const responseTimes: { [id: string]: Date } = {};
  let bestResult = Infinity;
  let bestResponseTime = new Date();
  let ended = false;
  let winner = '';

  const testEnded = async (): Promise<void> => {
    if (!ended) {
      ended = true;
      Object.keys(results).forEach((key: string): void => {
        const skt = socketList[key];
        if (skt) {
          let value = 0;
          values[key] = results[key].trim().length;
          value = results[key].trim().length;
          if (value > bestResult) {
            bestResult = value;
            bestResponseTime = responseTimes[key];
            winner = key;
          } else if (value === bestResult) {
            if(responseTimes[key] < bestResponseTime) {
              bestResponseTime = responseTimes[key];
              winner = key;
            }     
          }
        }
      });
      if (winner) {
        const skt = socketList[winner];
        if (skt) {
          out.info(`${colors.blue(
            skt.teamName || 'Unnamed',
          )} wins: ${colors.green(bestResult.toString())} points`);
          skt.score += bestResult;
        }
      }
    }
  };

  out.info(`Sending letters: ${JSON.stringify(message)}`);

  sockets.forEach((skt): void => {
    skt.on(transaction, async (result: string): Promise<void> => {
      const trimedRes = result.trim();
      const start = new Date();      
      results[skt.id] = trimedRes;
      responseTimes[skt.id] = start;
      out.info(
        `Obtained result from ${colors.blue(
          skt.teamName || 'Unnamed',
        )}: ${colors.green(trimedRes)}`,
      );
      if (Object.keys(results).length === sockets.length) {
        testEnded();
      }
    });
    skt.emit('letters', message)
  });
  setTimeout((): void => {
    if (!ended) {
      out.info('Ended by 1 second TimeOut');
      testEnded();
    }
  }, 1000);
};

export default runLetters;
