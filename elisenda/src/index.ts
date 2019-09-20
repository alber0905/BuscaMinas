import colors from 'colors';
import getPort from 'get-port';
import readline from 'readline';
import server from './server';
import out from './util/out';
import { getCommandFunction } from './commands/consoleCommands';
import setupBasicConsoleCommands from './commands/setupBasicConsoleCommands';
import setting from './config/settings';

const options = {
  dev: process.env.NODE_ENV === 'development',
  port: setting.defaultPort,
};

if (options.dev) {
  out.setLevel('verbose');
}
const startServer = async (): Promise<void> => {
  let port = await getPort({ port: options.port });

  if (process.env.NODE_ENV !== 'development') {
    port = 80;
  }

  server(options.dev, port).then((value): void => {
    if (options.dev) {
      const write = (text: string): void => {
        process.stdout.write(text);
      };
      const rl = readline.createInterface(process.stdin, process.stdout);
      setupBasicConsoleCommands(rl, value);
      rl.on(
        'line',
        async (cmd: string): Promise<void> => {
          const params = cmd.trim().split(' ');
          let command = params[0];
          if (command) {
            if (command === 'quit') command = 'exit';

            const onExecute = getCommandFunction(command);

            if (onExecute) {
              try {
                const [, ...rest] = params;
                await onExecute(write, ...rest);
              } catch (err) {
                out.error(err.message, { stack: err.stack });
              }
              write('\n');
            } else {
              write(
                `Unknown command: ${colors.red(command)}.\nUse ${colors.green(
                  'help',
                )} for the command list.\n`,
              );
            }
          }
        },
      );
    }
  });
};

startServer();
