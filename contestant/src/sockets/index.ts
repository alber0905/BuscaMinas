import io from 'socket.io-client';
import out from '../util/out';
import { getBestWord } from '../letters/utils/index';

out.info('Hola BinPar!');

const socket1 = io('http://192.168.1.19:9230', {
  autoConnect: false,
  path: '/ws',
});

export interface SocketMessage<ReturnType> {
  ok: boolean;
  e?: string;
  stack?: string;
  d: ReturnType;
}

export function execute<ReturnType>(
  name: string,
  param?: string,
  socket?: any,
): Promise<ReturnType> {
  // eslint-disable-next-line prefer-rest-params
  return new Promise<ReturnType>((resolve, reject): void => {
    const id = Math.round(Math.random() * 1000000).toString();
    if (socket) {
      socket.on(id, (res: SocketMessage<ReturnType>): void => {
        socket.off(id);
        if (res.ok) {
          resolve(res.d);
        } else {
          const error = new Error(res.e);
          error.stack = res.stack;
          reject(error);
        }
      });
    }
    if (param) {
      socket.emit(name as string, id, param);
    } else {
      socket.emit(name as string, id);
    }
  });
}

export async function connect() {
  return new Promise(resolve => {
    const socket = io('http://192.168.1.19:9230', {
      autoConnect: false,
      path: '/ws',
    });

    socket.on(
      'connect',
      async (): Promise<void> => {
        try {
          const result = await execute<string>('check', undefined, socket);
          await execute<void>('login', 'undefined', socket);
          out.info(result);
          socket.on(
            'letters',
            async (info: LetterResponse): Promise<void> => {
              const { transaction, letters } = info;
              const wordSelected = getBestWord(letters);
              socket.emit(transaction, wordSelected);
              out.info(`transaction: ${transaction}, letters: ${letters}`);
            },
          );
          // await execute<void>('test', 'letters', socket);
          socket.on(
            'ciphers',
            async (info: CiphersResponse): Promise<void> => {
              const { transaction, ciphers } = info;
              socket.emit(transaction, '');
              out.info(`transaction: ${transaction}, letters: ${ciphers}`);
            },
          );
          await execute<void>('test', 'ciphers', socket);
        } catch (e) {
          out.info(`Error: ${e.stack}`);
        }
      },
    );
    socket.connect();
  });
}

interface CiphersResponse {
  transaction: string;
  ciphers: number[];
  expectedResult: number;
}

export interface LetterResponse {
  transaction: string;
  letters: string[];
}
