import fs from 'fs';
import { getSessionPath } from '../config';

export async function logout(): Promise<void> {
  const sessionDir = getSessionPath();
  if (fs.existsSync(sessionDir)) {
    fs.rmSync(sessionDir, { recursive: true, force: true });
    console.log('Sesión eliminada.');
  } else {
    console.log('No hay sesión activa.');
  }
}
