import type { H3Event } from "nitro/h3";

import { z } from "zod";

export function createEnv(event: H3Event) {
  const url = new URL(event.req.url);
  const productionEnv = (event.runtime?.cloudflare as any)?.env;
  const developmentEnv = (event.context?.cloudflare as any)?.env;

  return z
    .object({
      AUTH_SECRET: z.string(),
      BASE_URL: z.url().default(url.origin),
      CLOUDFLARE_D1: z.any(),
      CLOUDFLARE_DO: z.any(),
    })
    .readonly()
    .parse(import.meta.env.MODE === "production" ? productionEnv : developmentEnv);
}

export type Env = ReturnType<typeof createEnv>;
