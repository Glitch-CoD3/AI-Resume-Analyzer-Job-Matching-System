import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2];
if (mode !== "development" && mode !== "production") {
  throw new Error("Specify either development or production mode.");
}

const backendDirectory = fileURLToPath(new URL("../", import.meta.url));
const isDevelopment = mode === "development";
const executable = isDevelopment
  ? resolve(backendDirectory, "node_modules", "nodemon", "bin", "nodemon.js")
  : resolve(backendDirectory, "index.js");
const args = isDevelopment ? [executable, "index.js"] : [executable];

const server = spawn(process.execPath, args, {
  cwd: backendDirectory,
  env: { ...process.env, NODE_ENV: mode },
  stdio: "inherit",
});

server.on("error", (error) => {
  console.error(`Failed to start ${mode} server:`, error);
  process.exitCode = 1;
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
