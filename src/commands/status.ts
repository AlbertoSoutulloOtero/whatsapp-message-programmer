import fs from 'fs';
import { getSessionPath } from '../config';

export async function status(): Promise<void> {
  const sessionDir = getSessionPath();
  if (fs.existsSync(sessionDir)) {
    console.log('✅ Hay una sesión de WhatsApp guardada.');
  } else {
    console.log('❌ No hay sesión de WhatsApp. Ejecuta "notify-wa login".');
  }
}
