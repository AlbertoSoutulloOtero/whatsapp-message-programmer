#!/usr/bin/env node

import { Command } from 'commander';
import { createClient } from './whatsapp/client';
import { run } from './commands/run';
import { pipe } from './commands/pipe';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { status } from './commands/status';

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
    const phone = process.env.NOTIFY_WA_PHONE;
    if (!phone) {
      console.error('Error: variable de entorno NOTIFY_WA_PHONE no definida.');
      console.error('  Ejemplo: $env:NOTIFY_WA_PHONE="521234567890"');
      process.exit(1);
    }

    const client = await createClient();
    await client.initialize();
    await run(cmdArgs, phone);
  });

program
  .command('pipe')
  .description('Leer entrada por pipe y notificar al cerrarse')
  .action(async () => {
    const phone = process.env.NOTIFY_WA_PHONE;
    if (!phone) {
      console.error('Error: variable de entorno NOTIFY_WA_PHONE no definida.');
      console.error('  Ejemplo: $env:NOTIFY_WA_PHONE="521234567890"');
      process.exit(1);
    }

    const client = await createClient();
    await client.initialize();
    await pipe(phone);
  });

program.parse(process.argv);
