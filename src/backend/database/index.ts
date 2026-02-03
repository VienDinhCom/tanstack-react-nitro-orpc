import { drizzle } from "drizzle-orm/d1";

import type { Env } from "@/backend/lib/env";

import * as schema from "./schema";

export function createDatabase(env: Env) {
  return drizzle(env.CLOUDFLARE_D1, { schema, casing: "snake_case" });
}

export * as schema from "./schema";
export * as orm from "drizzle-orm";
