import { runCommand } from '../process/wrapper';
import { formatSuccess, formatError, formatDuration } from '../formatter';
import { getClient } from '../whatsapp/client';

export async function run(args: string[], phone: string): Promise<void> {
  if (args.length === 0) {
    console.error('Error: debes especificar un comando.');
    console.error('  notify-wa run -- <comando>');
    process.exit(1);
  }

  const command = args.join(' ');

  console.log(`Ejecutando: ${command}`);
  const result = await runCommand(command);

  const duration = formatDuration(result.durationMs);

  const message = result.exitCode === 0
    ? formatSuccess(result.command, duration)
    : formatError(result.command, duration, result.exitCode, result.stderr);

  console.log(`\nNotificando a WhatsApp...`);
  const client = getClient();
  if (client) {
    await client.sendMessage(`${phone}@c.us`, message);
    console.log('Notificación enviada.');
  } else {
    console.error('Error: no hay sesión de WhatsApp activa. Ejecuta "notify-wa login" primero.');
    process.exit(1);
  }
}
