import io from 'socket.io';

export interface Socket extends io.Socket {
  teamName?: string;
  score: number;
}
export interface SocketEvent {
  (socket: Socket): void;
}

const socketList: { [id: string]: Socket } = {};

export default socketList;
