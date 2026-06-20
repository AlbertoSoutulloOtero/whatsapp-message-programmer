import { spawn } from 'child_process';

export interface RunResult {
  command: string;
  durationMs: number;
  exitCode: number;
  stderr: string;
}

export function runCommand(command: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const stderrChunks: string[] = [];
    const MAX_STDERR_CHARS = 2000;

    const child = spawn(command, [], {
      shell: true,
      stdio: ['inherit', 'inherit', 'pipe'],
    });

    child.stderr?.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stderrChunks.push(text);

      let total = 0;
      for (let i = stderrChunks.length - 1; i >= 0; i--) {
        total += stderrChunks[i].length;
        if (total > MAX_STDERR_CHARS) {
          stderrChunks.splice(0, i);
          break;
        }
      }

      process.stderr.write(text);
    });

    child.on('close', (exitCode) => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      resolve({
        command,
        durationMs,
        exitCode: exitCode ?? -1,
        stderr: stderrChunks.join(''),
      });
    });
  });
}
