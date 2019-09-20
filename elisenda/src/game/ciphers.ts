import socketList, {Socket} from '../util/connections';
import out from '../util/out';

const allowedValues = [1,2,3,4,5,6,7,8,9,10,25,50,75,100];

const runCiphers = async (socket?: Socket): Promise<void> => {
  let sockets: Socket[] = [];

  if (socket) {
    sockets = [socket];
  } else {
    sockets = Object.keys(socketList).map((key): Socket=> socketList[key]);
  }

  const numbers = allowedValues.sort((): number => Math.random() > 0.5 ? 1 : -1);
  const ciphers = numbers.slice(0,6);
  const transaction = Math.round(Math.random() * 1000000).toString();
  const message = {
    transaction,
    ciphers,
    expectedResult: 101 + Math.floor(Math.random() * 898),
  };

  out.info(`Sending ciphers: ${JSON.stringify(message)}`);

  sockets.forEach((skt): void => {
    skt.emit('ciphers', message)
  });
};

export default runCiphers;
