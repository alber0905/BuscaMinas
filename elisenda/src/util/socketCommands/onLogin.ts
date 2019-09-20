import colors from 'colors';
import { APIFunctionInterface } from '../APIFunctionInterface';
import { Socket } from '../connections';
import out from '../out';

const onLogin: APIFunctionInterface<void> = async (
  socket: Socket,
  teamName,
): Promise<void> => {
  const fullTeamName = teamName as string;
  if (fullTeamName) {
    out.verbose(
      `Login from  ${colors.yellow.bold(
        socket.id,
      )} set teamName: ${colors.green.bold(fullTeamName)}`,
    );  
    const currentSocket = socket;
    currentSocket.teamName = fullTeamName;
  } else {
    throw Error('No team name provided');
  }
};

export default onLogin;
