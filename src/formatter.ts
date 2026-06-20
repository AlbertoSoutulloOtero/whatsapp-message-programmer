export function formatSuccess(command: string, duration: string): string {
  return [
    `✅ *${command}*`,
    '',
    `Completado en *${duration}*`,
  ].join('\n');
}

export function formatError(command: string, duration: string, exitCode: number, stderr: string): string {
  const lines: string[] = [
    `❌ *${command}*`,
    '',
    `Falló (exit code ${exitCode}) tras *${duration}*`,
  ];

  if (stderr) {
    const lastLines = stderr
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(-10);

    if (lastLines.length > 0) {
      lines.push('', 'Últimas líneas:');
      for (const line of lastLines) {
        lines.push(`  \`${line}\``);
      }
    }
  }

  return lines.join('\n');
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function formatPipeSuccess(duration: string, summary?: string): string {
  const msg = [
    `📥 Proceso por pipe completado en *${duration}*`,
  ];
  if (summary) msg.push('', `Salida: \`\`\`${summary}\`\`\``);
  return msg.join('\n');
}

export function formatPipeError(duration: string, stderr: string): string {
  const lines: string[] = [
    `📥❌ Proceso por pipe falló tras *${duration}*`,
  ];
  if (stderr) {
    lines.push('', 'Salida de error:');
    for (const line of stderr.split('\n').filter(l => l.trim()).slice(-10)) {
      lines.push(`  \`${line}\``);
    }
  }
  return lines.join('\n');
}
