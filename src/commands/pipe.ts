import { readPipe } from '../process/pipe-handler';
import { formatPipeSuccess, formatPipeError, formatDuration } from '../formatter';
import { getClient } from '../whatsapp/client';

export async function pipe(phone: string): Promise<void> {
  console.log('Esperando entrada por pipe...');
  const result = await readPipe();

  const duration = formatDuration(result.durationMs);

  const summary = result.stdout.length > 500
    ? result.stdout.slice(-500)
    : result.stdout;

  const message = result.exitCode === 0
    ? formatPipeSuccess(duration, summary)
    : formatPipeError(duration, result.stdout);

  const client = getClient();
  if (client) {
    await client.sendMessage(`${phone}@c.us`, message);
    console.log('Notificación enviada.');
  } else {
    console.error('Error: no hay sesión de WhatsApp activa. Ejecuta "notify-wa login" primero.');
    process.exit(1);
  }
}
