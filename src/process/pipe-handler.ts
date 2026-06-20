export interface PipeResult {
  durationMs: number;
  stdout: string;
  exitCode: number | null;
}

export function readPipe(): Promise<PipeResult> {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const chunks: string[] = [];
    const stdin = process.stdin;

    stdin.setEncoding('utf-8');
    stdin.on('data', (chunk: string) => {
      chunks.push(chunk);
    });

    stdin.on('end', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      resolve({
        durationMs,
        stdout: chunks.join(''),
        exitCode: 0,
      });
    });

    stdin.on('error', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      resolve({
        durationMs,
        stdout: chunks.join(''),
        exitCode: 1,
      });
    });
  });
}
