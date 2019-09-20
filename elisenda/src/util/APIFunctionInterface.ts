import io from 'socket.io';

export interface APIFunctionInterface<ReturnType> {
  (socket: io.Socket, ...args: [string | object | number | boolean]): Promise<ReturnType>;
}
