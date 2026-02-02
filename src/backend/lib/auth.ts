import type { DrizzleD1Database } from "drizzle-orm/d1";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type * as schema from "@/backend/database/schema";

export function createAuth(db: DrizzleD1Database<typeof schema>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    rateLimit: {
      enabled: true,
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
  });
}
