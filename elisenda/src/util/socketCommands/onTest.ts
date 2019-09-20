import colors from 'colors';
import { APIFunctionInterface } from '../APIFunctionInterface';
import { Socket } from '../connections';
import out from '../out';
import ciphers from '../../game/ciphers';
import letters from '../../game/letters';

const onTest: APIFunctionInterface<void> = async (
  socket: Socket,
  type,
): Promise<void> => {
  const testType = type as string;
  if (testType) {
    out.verbose(
      `Test from  ${colors.yellow.bold(
        socket.id,
      )} with teamName: ${colors.green.bold(socket.teamName || 'Unnamed')} of type ${colors.blue.bold(testType)}`,
    );
    switch (testType) {
      case 'ciphers':
          ciphers();
        break;
      case 'letters':
          letters();
        break;        
      default:
        throw Error(`Test type ${colors.red.bold(testType)} not accepted, use ${colors.blue.green('ciphers')} or ${colors.blue.green('letters')}`);    
    }
  } else {
    throw Error('No test type provided');
  }
};

export default onTest;
