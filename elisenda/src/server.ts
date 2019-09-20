import http from 'http';
import express from 'express';
import colors from 'colors';
import cors from 'cors';
import out from './util/out';
import socket from './util/socket';

interface ServerResponse {
  server: http.Server;
  close: () => void;
}

const server = (dev: boolean, port: number): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const httpServer = express();
    httpServer.use(cors());    
    const srv = http.createServer(httpServer);
    socket(srv);
    const listener = srv.listen(port, (): void => {
      out.info(
        colors.white.bold(
          `Listening ${colors.yellow.bold(
            `http://localhost:${port.toString()}/`,
          )}`,
        ),
      );
    });    
    listener.on('close', (): void => {
      out.info(colors.white.bold('http server closed'));
    });
    const close = (): void => {
      listener.close();
    };
    resolve({ server: listener, close });
  });
};

export default server;
