import { readPipe, PipeResult } from '../process/pipe-handler';
import { formatPipeSuccess, formatPipeError, formatDuration } from '../formatter';

export interface PipeOutput {
  message: string;
  result: PipeResult;
}

export async function read(): Promise<PipeOutput> {
  console.log('Esperando entrada por pipe...');
  const result = await readPipe();

  const duration = formatDuration(result.durationMs);
  const summary = result.stdout.length > 500
    ? result.stdout.slice(-500)
    : result.stdout;

  const message = result.exitCode === 0
    ? formatPipeSuccess(duration, summary)
    : formatPipeError(duration, result.stdout);

  return { message, result };
}
