import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { createClient } from '../whatsapp/client';
import { saveConfig, getSessionPath } from '../config';

export async function login(): Promise<void> {
  if (fs.existsSync(getSessionPath())) {
    console.log('Ya tienes una sesión activa. Si quieres renovarla, ejecuta "notify-wa logout" primero.');
    process.exit(0);
  }

  const client = await createClient();

  client.on('qr', (qr: string) => {
    console.log('Escanea este código QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    const phone = client.info.wid.user;
    saveConfig({ phone });
    console.log(`✅ Sesión iniciada correctamente como +${phone}.`);
    try {
      await client.destroy();
    } catch {
      // Ignore destroy errors
    }
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
