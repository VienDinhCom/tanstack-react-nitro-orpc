import { defineConfig } from "drizzle-kit";
import "dotenv/config";


export default defineConfig({
  dialect: "sqlite",
  casing: "snake_case",
  out: "./src/backend/database/migrations",
  schema: "./src/backend/database/schema/index.ts",
});
