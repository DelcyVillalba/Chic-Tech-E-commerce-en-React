import { spawn } from "child_process";
import { printBanner } from "./banner.js";

async function start() {
  await printBanner();
  const vite = spawn("npm", ["run", "dev:web"], {
    stdio: ["ignore", "ignore", "ignore"],
    shell: true,
    detached: false,
  });

  process.on("SIGINT", () => {
    try {
      process.kill(vite.pid);
    } catch {}
    process.exit(0);
  });
}

start();
