import { Client, LocalAuth } from 'whatsapp-web.js';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { getSessionPath } from '../config';

type ClientStatus = 'uninitialized' | 'initializing' | 'ready' | 'error';

let client: Client | null = null;
let status: ClientStatus = 'uninitialized';
let readyPromise: Promise<void> | null = null;

async function ensureChrome(): Promise<string | undefined> {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (fs.existsSync(envPath)) return envPath;
  }

  const {
    getInstalledBrowsers,
    install,
    Browser,
    detectBrowserPlatform,
  } = require('@puppeteer/browsers');

  const cacheDir = path.join(os.homedir(), '.cache', 'puppeteer');

  const installed = await getInstalledBrowsers({ cacheDir });
  const chromeInstalled = installed.find(
    (b: { browser: string }) => b.browser === Browser.CHROME
  );
  if (chromeInstalled) {
    const execPath = chromeInstalled.executablePath;
    if (fs.existsSync(execPath)) return execPath;
  }

  const systemPath = findSystemChrome();
  if (systemPath) return systemPath;

  console.log('Chromium no encontrado. Descargando... (solo la primera vez, ~170MB)');

  const browserPlatform = detectBrowserPlatform();
  const result = await install({
    browser: Browser.CHROME,
    buildId: 'latest',
    cacheDir,
    platform: browserPlatform,
  });

  return result.executablePath;
}

function findSystemChrome(): string | undefined {
  const paths: string[] = [];

  if (process.platform === 'win32') {
    paths.push(
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    );
  } else if (process.platform === 'darwin') {
    paths.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  } else {
    paths.push(
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    );
  }

  return paths.find(p => fs.existsSync(p));
}

export async function createClient(): Promise<Client> {
  if (client) return client;

  status = 'initializing';

  const executablePath = await ensureChrome();
  const puppeteerOptions: Record<string, unknown> = {
    headless: true,
    args: ['--no-sandbox'],
  };
  if (executablePath) {
    puppeteerOptions.executablePath = executablePath;
  }

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: getSessionPath() }),
    puppeteer: puppeteerOptions,
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
