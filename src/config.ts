import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.notify-wa');
const SESSION_DIR = path.join(CONFIG_DIR, 'session');

export function getConfigDir(): string {
  return CONFIG_DIR;
}

export function getSessionPath(): string {
  return SESSION_DIR;
}
