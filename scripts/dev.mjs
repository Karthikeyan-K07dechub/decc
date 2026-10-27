import { openSync, readFileSync, writeFileSync, closeSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const lockPath = join(root, ".dev-server.lock");
const ownerPid = process.pid;
const alive = (pid) => {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error.code !== "ESRCH"; }
};

// Exclusive creation prevents simultaneous npm run dev commands sharing a cache.
let lock;
for (let attempt = 0; attempt < 2; attempt++) {
  try {
    lock = openSync(lockPath, "wx");
    break;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    let previous;
    try { previous = JSON.parse(readFileSync(lockPath, "utf8")); }
    catch {
      console.error("The development server is starting. Wait a moment before retrying.");
      process.exit(1);
    }
    if (alive(previous.ownerPid) || alive(previous.serverPid)) {
      console.error("A DECC development server is already running. Use that preview or stop it before restarting.");
      process.exit(1);
    }
    // A force-closed terminal can leave a lock after both processes have exited.
    try { unlinkSync(lockPath); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}
if (lock === undefined) {
  console.error("Another development server is starting. Try again shortly.");
  process.exit(1);
}
writeFileSync(lock, JSON.stringify({ ownerPid }));
closeSync(lock);

const release = () => {
  try {
    if (JSON.parse(readFileSync(lockPath, "utf8")).ownerPid === ownerPid) unlinkSync(lockPath);
  } catch (error) { if (error.code !== "ENOENT") console.error("Could not release development lock:", error.message); }
};
process.on("exit", release);
const require = createRequire(import.meta.url);
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
  windowsHide: true,
});
if (server.pid) writeFileSync(lockPath, JSON.stringify({ ownerPid, serverPid: server.pid }));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
server.on("error", (error) => { console.error(error); process.exit(1); });
server.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
