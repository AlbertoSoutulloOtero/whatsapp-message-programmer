# notify-wa

**Run any command from your terminal and get a WhatsApp notification when it finishes.**

Training an AI model for hours? Long build times? Tests taking forever? Instead of watching the terminal, wrap your command with `notify-wa` and receive a WhatsApp message on your phone when it's done — including the result, duration, and any errors.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** (≥18) | Runtime environment |
| **TypeScript** | Programming language (static typing) |
| **whatsapp-web.js** | Unofficial WhatsApp Web client. Automates a Chromium browser (via Puppeteer) to connect to WhatsApp Web |
| **commander** | Framework for building the command-line interface (CLI) |
| **qrcode-terminal** | Renders QR codes directly in the terminal for login |
| **Puppeteer** | Headless Chromium browser used internally by whatsapp-web.js |

## Installation

```bash
git clone <repo-url>
cd whatsapp-message-programmer
npm install
npm run build
```

To use it globally without typing `node dist/index.js` every time:

```bash
npm link
```

This makes the `notify-wa` command available everywhere in your terminal.

## Usage

### 1. Link your WhatsApp

First time only:

```bash
notify-wa login
```

A QR code will appear in your terminal. Scan it with WhatsApp (menu → Linked devices → Link a device). The session is saved for future use.

### 2. Set your phone number

```bash
# Windows PowerShell
$env:NOTIFY_WA_PHONE="521234567890"

# Linux / macOS / Git Bash
export NOTIFY_WA_PHONE="521234567890"
```

Format: country code + phone number, no `+`, no spaces, no dashes.

### 3a. Wrapper mode (recommended)

Run any command and get notified when it finishes:

```bash
notify-wa run -- npm run build
notify-wa run -- python train_model.py --epochs 100
notify-wa run -- npx jest --watch
```

You'll see the command output live in your terminal. When it finishes, the WhatsApp notification arrives.

### 3b. Pipe mode

Capture the output of an existing process:

```bash
npm run build | notify-wa pipe
ping google.com -n 10 | notify-wa pipe
```

### Session management

```bash
notify-wa status    # Check if a session is active
notify-wa logout    # Delete the session (requires login again)
```

## Message examples

**Success:**
> ✅ *npm run build*
>
> Completed in *2m 34s*

**Error:**
> ❌ *python train.py*
>
> Failed (exit code 1) after *1h 12m 5s*
>
> Last lines:
>   `RuntimeError: CUDA out of memory`
>   `    at train.py:42`

**Pipe:**
> 📥 Pipe process completed in *45s*
>
> Output: \`\`\`(last lines of output)\`\`\`

## Project structure

```
src/
├── index.ts              ← Entry point (commander)
├── config.ts             ← Configuration paths
├── formatter.ts          ← WhatsApp message formatting
├── whatsapp/
│   └── client.ts         ← WhatsApp client (singleton)
├── process/
│   ├── wrapper.ts        ← Child process execution
│   └── pipe-handler.ts   ← Stdin reading
└── commands/
    ├── run.ts            ← notify-wa run
    ├── pipe.ts           ← notify-wa pipe
    ├── login.ts          ← notify-wa login
    ├── logout.ts         ← notify-wa logout
    └── status.ts         ← notify-wa status
```

## Available scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript to JavaScript (`dist/`) |
| `npm run dev` | Run in development mode without compiling |
| `npm start` | Run the compiled version |

## License

MIT
