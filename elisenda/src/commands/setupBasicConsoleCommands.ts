import ReadLine from 'readline';
import colors from 'colors';
import out from '../util/out';
import { addCommand, getCommands } from './consoleCommands';
import ciphers from '../game/ciphers';
import letters from '../game/letters';

/**
 * Element that can be closed
 */
interface Closeable {
  close: () => void;
}

/**
 * Setups all the commands that can by used by te console
 * @param rl Console Interface
 * @param value Server Information
 */
const setupBasicConsoleCommands = (
  rl: ReadLine.Interface,
  value: Closeable
): void => {
  addCommand({
    name: 'exit',
    description: 'Exit the Elisenda Server',
    onExecute: async (write): Promise<void> => {
      write(`Exiting  ${colors.magenta('Elisenda')} Server\n`);
      value.close();
      rl.close();
      process.stdin.destroy();
      process.exit();
    },
  });


  addCommand({
    name: 'help',
    description: 'Displays this help window',
    onExecute: async (write): Promise<void> => {
      write(`Commands:\n`);

      getCommands().forEach(
        (command): void => {
          write(
            `  ${colors.green(command.name.padEnd(25))} ${
              command.description
            }\n`
          );
        }
      );

      write('\n');
    },
  });

  addCommand({
    name: 'setLogLevel',
    description:
      'Set the log leve to the value specified: error, warning, info or verbose',
    onExecute: async (write, param?: string): Promise<void> => {
      if (param) {
        const level = param.toLowerCase();
        out.setLevel(level);
        write(`Log level set to ${colors.green(level)}.\n`);
      } else {
        write(
          `You need to specify a log level.\nUse ${colors.green(
            'help'
          )} for the command list.\n`
        );
      }
    },
  });

  addCommand({
    name: 'ciphers',
    description:
      'Run a Ciphers Quest',
    onExecute: async (): Promise<void> => {
      ciphers();
    },
  });

  addCommand({
    name: 'letters',
    description:
      'Run a Letters Quest',
    onExecute: async (): Promise<void> => {
      letters();
    },
  });
};

export default setupBasicConsoleCommands;
