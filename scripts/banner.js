import chalk from "chalk";
import fetch from "node-fetch";

export async function printBanner() {
  const FRONT = "http://localhost:5173";
  const BACK = "https://chic-tech-api-production.up.railway.app";

  let backendStatus = chalk.red("✘ Offline");
  try {
    const r = await fetch(`${BACK}/products`);
    if (r.ok) backendStatus = chalk.green("✔ Online");
  } catch {
    backendStatus = chalk.red("✘ Offline");
  }

  console.clear();
  console.log(
    chalk.magenta.bold(
      "============================================================"
    )
  );
  console.log(chalk.bold("        🚀 CHIC & TECH – ENTORNO DE DESARROLLO"));
  console.log(
    chalk.magenta.bold(
      "============================================================\n"
    )
  );

  console.log(`🖥️  FRONTEND:  ${chalk.cyan(FRONT)}`);
  console.log(`🔌  BACKEND:   ${chalk.cyan(BACK)}  ${backendStatus}`);

  console.log(`\n📦  Modo Dev activo.`);
  console.log(
    chalk.magenta.bold(
      "============================================================\n"
    )
  );
}
