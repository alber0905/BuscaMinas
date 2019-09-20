import io from 'socket.io';
import http from 'http';
import colors from 'colors';
import setting from '../config/settings';
import out from './out';
import { addCommand } from '../commands/consoleCommands';
import socketList, {Socket, SocketEvent} from './connections';
import { APIFunctionInterface } from './APIFunctionInterface';
import onPing from './socketCommands/onPing';
import onLogin from './socketCommands/onLogin';
import onTest from './socketCommands/onTest';

const options = { path: setting.socketPath };
let currentServer: io.Server | undefined;


const onDisconnect = (socket: Socket): void => {
  out.verbose(
    colors.white.bold(`Disconnected ${colors.yellow.bold(socket.id)}`),
  )
  delete socketList[socket.id];
};

async function methodWrapper<ReturnType>(
  socket: io.Socket,
  methodName: string,
  targetMethod: APIFunctionInterface<ReturnType>,
): Promise<void> {
  socket.on(
    methodName,
    async (id: string, ...params: [string | object]): Promise<void> => {
      try {
        const res = await targetMethod(socket, ...params);
        socket.emit(id, { ok: true, d: res });
      } catch (err) {
        socket.emit(id, { ok: false, e: err.message, stack: err.stack });
      }
    },
  );
}

const initServiceSubscriptions = new Array<SocketEvent>();

const initService: SocketEvent = (socket): void => {
  initServiceSubscriptions.forEach((subscription): void => {
    try {
      subscription(socket);
    } catch (ex) {
      out.warn(ex);
    }
  });
};

const setup = (httpServer: http.Server): void => {
  const server = io(httpServer, options);
  currentServer = server;
  server.on('connection', (socket: Socket): void => {
    out.verbose(
      colors.white.bold(`Connected ${colors.yellow.bold(socket.id)}`),
    );
    const skt = socket;
    skt.score = 0;
    socketList[socket.id] = skt;
    socket.on('disconnect', (): void => onDisconnect(socket));    
    methodWrapper<string>(socket, 'check', onPing);
    methodWrapper<void>(socket, 'test', onTest);
    methodWrapper<void>(socket, 'login', onLogin);
    initService(socket);
  });

  addCommand({
    name: 'list',
    description: 'List all users connected to the server',
    onExecute: async (write): Promise<void> => {
      write(
        `${colors.green.bold(
          Object.keys(socketList).length.toString(),
        )} active connections`,
      );
      Object.keys(socketList).forEach((id): void => {
        const skt = socketList[id];
        write(
          ` ${colors.green.bold(id)} from remote IP ${colors.red.bold(
            skt.client.conn.remoteAddress,
          )}`,
        );
      });
    },
  });
};

export const emit = (
  eventName: string,
  ...params: [string | object | number]
): void => {
  if (currentServer) {
    currentServer.emit(eventName, params);
  }
};

export default setup;
