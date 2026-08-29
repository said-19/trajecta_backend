/**
 * Frees TCP port 4000 on Windows/Unix so nest can bind cleanly.
 * Usage: node scripts/free-port.js [port]
 */
const { execSync } = require('child_process');

const port = Number(process.argv[2] || 4000);

function freePortWindows(p) {
  let out = '';
  try {
    out = execSync('netstat -ano', { encoding: 'utf8' });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    if (!line.includes(`:${p}`) || !line.includes('LISTENING')) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid) && pid !== '0') pids.add(pid);
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      console.log(`Freed port ${p} (killed PID ${pid})`);
    } catch {
      /* already gone */
    }
  }
}

function freePortUnix(p) {
  try {
    const out = execSync(`lsof -ti tcp:${p}`, { encoding: 'utf8' }).trim();
    if (!out) return;
    for (const pid of out.split(/\s+/)) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        console.log(`Freed port ${p} (killed PID ${pid})`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* nothing listening */
  }
}

if (process.platform === 'win32') freePortWindows(port);
else freePortUnix(port);
