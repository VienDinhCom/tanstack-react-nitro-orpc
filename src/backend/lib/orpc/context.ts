import type { H3Event } from "nitro/h3";

import { createDb } from "@/backend/database";
import { createAuth } from "@/backend/lib/auth";

export async function createORPCContext(event: H3Event) {
  const check = (value: unknown, message: string) => {
    if (!value) {
      throw new Error(message);
    }
    return value;
  };

  const env = (event.context as any).cloudflare?.env as { DB: D1Database } | undefined;
  const d1 = check(env?.DB, "Missing D1 database binding");

  const db = createDb(d1 as D1Database);
  const auth = createAuth(db);

  return { event, db, auth };
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>;
