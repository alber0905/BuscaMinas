import io from 'socket.io-client';
import out from './util/out';

out.info('Hola BinPar!');

const socket = io('http://localhost:9230', {
  autoConnect: false,
  path: '/ws',
});

export interface SocketMessage<ReturnType> {
  ok: boolean;
  e?: string;
  stack?: string;
  d: ReturnType;
}

function execute<ReturnType>(
  name: string, param?: string
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

async function connect(): Promise<void> {
  socket.on(
    'connect',
    async (): Promise<void> => {
      out.info('Connected...');
      try {
        const result = await execute<string>('check');
        if (result === 'pong') {
          await execute<void>('login', 'Unicorns Of Love');
          await execute<void>('test', 'ciphers');
        }
      } catch (ex) {
        out.error(ex.message);
      }
    },
  );
  socket.on('disconnect', (): void => {
    out.info('Disconnected...');
  });
  socket.connect();
}

connect();
