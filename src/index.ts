#!/usr/bin/env node

import { Command } from 'commander';
import { execute } from './commands/run';
import { read } from './commands/pipe';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { status } from './commands/status';
import { sendNotification } from './notifier';

const program = new Command();

program
  .name('notify-wa')
  .description('CLI que notifica por WhatsApp cuando un proceso termina')
  .version('0.1.0');

program
  .command('login')
  .description('Iniciar sesión en WhatsApp escaneando un código QR')
  .action(() => login());

program
  .command('logout')
  .description('Cerrar sesión de WhatsApp')
  .action(() => logout());

program
  .command('status')
  .description('Verificar si hay una sesión activa')
  .action(() => status());

program
  .command('run')
  .description('Ejecutar un comando y notificar al terminar')
  .allowExcessArguments(true)
  .allowUnknownOption()
  .argument('[command...]', 'comando a ejecutar (ej: npm run build)')
  .action(async (cmdArgs: string[]) => {
    const { message } = await execute(cmdArgs);
    await sendNotification(message);
  });

program
  .command('pipe')
  .description('Leer entrada por pipe y notificar al cerrarse')
  .action(async () => {
    const { message } = await read();
    await sendNotification(message);
  });

program.parse(process.argv);
