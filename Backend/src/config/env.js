import dotenv from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const backendDirectory = fileURLToPath(new URL("../../", import.meta.url));

dotenv.config({
  path: resolve(backendDirectory, ".env"),
  quiet: true,
});
