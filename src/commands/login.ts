import qrcode from 'qrcode-terminal';
import { createClient, getClient, getStatus } from '../whatsapp/client';

export async function login(): Promise<void> {
  const client = await createClient();

  client.on('qr', (qr: string) => {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('✅ Sesión iniciada correctamente.');
    process.exit(0);
  });

  client.on('auth_failure', (msg: string) => {
    console.error('❌ Error de autenticación:', msg);
    process.exit(1);
  });

  client.on('disconnected', (reason: string) => {
    console.error('❌ Desconectado:', reason);
    process.exit(1);
  });

  await client.initialize();
}
