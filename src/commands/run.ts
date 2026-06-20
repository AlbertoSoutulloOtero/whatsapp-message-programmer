import { runCommand, RunResult } from '../process/wrapper';
import { formatSuccess, formatError, formatDuration } from '../formatter';

export interface RunOutput {
  message: string;
  result: RunResult;
}

export async function execute(args: string[]): Promise<RunOutput> {
  if (args.length === 0) {
    console.error('Error: debes especificar un comando.');
    console.error('  notify-wa run -- <comando>');
    process.exit(1);
  }

  const command = args.join(' ');
  console.log(`Ejecutando: ${command}`);

  const result = await runCommand(command);
  const duration = formatDuration(result.durationMs);

  const message = result.exitCode === 0
    ? formatSuccess(result.command, duration)
    : formatError(result.command, duration, result.exitCode, result.stderr);

  return { message, result };
}
