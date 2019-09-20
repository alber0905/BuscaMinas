import colors from 'colors';
import socketList, { Socket } from '../util/connections';
import out from '../util/out';

const allowedValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];

const runCiphers = async (socket?: Socket): Promise<void> => {
  let sockets: Socket[] = [];

  if (socket) {
    sockets = [socket];
  } else {
    sockets = Object.keys(socketList).map((key): Socket => socketList[key]);
  }

  const numbers = allowedValues.sort((): number =>
    Math.random() > 0.5 ? 1 : -1,
  );
  const ciphers = numbers.slice(0, 6);
  const transaction = Math.round(Math.random() * 1000000).toString();
  const expectedResult = 101 + Math.floor(Math.random() * 898);
  const message = {
    transaction,
    ciphers,
    expectedResult,
  };

  out.info(`Sending ciphers: ${JSON.stringify(message)}`);

  const results: { [id: string]: string } = {};
  const values: { [id: string]: number } = {};
  const responseTimes: { [id: string]: Date } = {};
  let bestResult = Infinity;
  let bestResponseTime = new Date();
  let ended = false;
  let winner = '';
  const testEnded = (): void => {
    if (!ended) {
      ended = true;
      Object.keys(results).forEach((key: string): void => {
        const skt = socketList[key];
        if (skt) {
          let value = 0;
          try {
            // eslint-disable-next-line no-eval
            value = eval(results[key]) as number;
          } catch (ex) {
            value = 0;
          }
          values[key] = value;
          const result = Math.abs(expectedResult - value);
          if (result < bestResult) {
            bestResult = result;
            bestResponseTime = responseTimes[key];
            winner = key;
          } else if(result === bestResult) {
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
          if (bestResult === 0) {
            out.info(`${colors.blue(
              skt.teamName || 'Unnamed',
            )} wins: ${colors.green('8')} points`);
            skt.score += 8;
          } else {
            out.info(`${colors.blue(
              skt.teamName || 'Unnamed',
            )} wins: ${colors.green('6')} points`);
            skt.score += 6;
          }
        }
      }
    }
  };

  sockets.forEach((skt): void => {
    skt.on(transaction, (result: string): void => {
      const trimedRes = result.trim();
      results[skt.id] = trimedRes;
      responseTimes[skt.id] = new Date();
      out.info(
        `Obtained result from ${colors.blue(
          skt.teamName || 'Unnamed',
        )}: ${colors.green(trimedRes)}`,
      );
      if (Object.keys(results).length === sockets.length) {
        testEnded();
      }
    });
    skt.emit('ciphers', message);
  });
  setTimeout((): void => {
    if (!ended) {
      out.info('Ended by 1 second TimeOut');
      testEnded();
    }
  }, 1000);
};

export default runCiphers;
