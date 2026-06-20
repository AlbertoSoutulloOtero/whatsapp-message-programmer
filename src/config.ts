import path from 'path';
import fs from 'fs';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.notify-wa');
const SESSION_DIR = path.join(CONFIG_DIR, 'session');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export interface Config {
  phone?: string;
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}

export function getSessionPath(): string {
  return SESSION_DIR;
}

export function getConfig(): Config {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return {};
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}
