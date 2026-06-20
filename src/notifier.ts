import { getConfig } from './config';
import { createClient, waitForReady } from './whatsapp/client';

const CONNECT_TIMEOUT_MS = 30_000;

export async function sendNotification(message: string): Promise<void> {
  const config = getConfig();
  if (!config.phone) {
    console.error('Error: no hay número de teléfono configurado. Ejecuta "notify-wa login" primero.');
    process.exit(1);
  }

  console.log('\nConectando con WhatsApp...');
  const client = await createClient();

  const timeout = setTimeout(() => {
    console.error(`\nError: tiempo de espera agotado (${CONNECT_TIMEOUT_MS / 1000}s).`);
    process.exit(1);
  }, CONNECT_TIMEOUT_MS);

  client.on('qr', () => {
    clearTimeout(timeout);
    console.error('\nError: sesión de WhatsApp no válida o expirada.');
    console.error('Ejecuta "notify-wa login" para autenticarte de nuevo.');
    process.exit(1);
  });

  try {
    await client.initialize();
    await waitForReady();
    clearTimeout(timeout);
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\nError al conectar con WhatsApp: ${message}`);
    console.error('Ejecuta "notify-wa login" para renovar la sesión.');
    process.exit(1);
  }

  console.log('Enviando notificación...');
  await client.sendMessage(`${config.phone}@c.us`, message);
  console.log('✅ Notificación enviada.');
}
