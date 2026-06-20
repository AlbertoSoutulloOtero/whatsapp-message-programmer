import { Client, LocalAuth } from 'whatsapp-web.js';
import { getSessionPath } from '../config';

type ClientStatus = 'uninitialized' | 'initializing' | 'ready' | 'error';

let client: Client | null = null;
let status: ClientStatus = 'uninitialized';
let readyPromise: Promise<void> | null = null;

export async function createClient(): Promise<Client> {
  if (client) return client;

  status = 'initializing';
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: getSessionPath() }),
    puppeteer: { headless: true, args: ['--no-sandbox'] },
  });

  readyPromise = new Promise((resolve, reject) => {
    client!.on('ready', () => {
      status = 'ready';
      resolve();
    });
    client!.on('auth_failure', (msg) => {
      status = 'error';
      reject(new Error(`Auth failure: ${msg}`));
    });
  });

  return client;
}

export function getClient(): Client | null {
  return client;
}

export function getStatus(): ClientStatus {
  return status;
}

export async function waitForReady(): Promise<void> {
  if (status === 'ready') return;
  if (!readyPromise) throw new Error('Client not created. Call createClient() first.');
  await readyPromise;
}
