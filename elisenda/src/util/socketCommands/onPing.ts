import colors from 'colors';
import { APIFunctionInterface } from '../APIFunctionInterface';
import { Socket } from '../connections';
import out from '../out';

const onPing: APIFunctionInterface<string> = async (
  socket: Socket,
): Promise<string> => {
  out.verbose(
    `Ping from  ${colors.yellow.bold(
      socket.id,
    )} with team: ${colors.green.bold(socket.teamName || 'Unnamed')}`,
  );
  return 'pong';
};

export default onPing;
