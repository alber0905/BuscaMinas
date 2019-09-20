import io from 'socket.io-client';
import out from '../../util/out';
import { execute, LetterResponse, connect } from '../../sockets/index';

test('connecting people', async (): Promise<void> => {
  await connect();
});
