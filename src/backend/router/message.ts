import { z } from "@esmate/shadcn/pkgs/zod";
import { invariant } from "@esmate/utils";
import { DurablePublisher } from "@orpc/experimental-publisher-durable-object";
import { eventIterator } from "@orpc/server";

import { createDatabase, orm, schema } from "@/backend/database";
import { authMiddleware, os } from "@/backend/lib/orpc";
import { MessageInsertSchema, MessageSelectSchema, MessageSelectSchemaWithSender } from "@/shared/schema";

export const message = {
  add: os
    .use(authMiddleware)
    .input(MessageInsertSchema)
    .output(MessageSelectSchema)
    .handler(async ({ input, context }) => {
      const db = createDatabase(context.env);

      const [message] = await db
        .insert(schema.message)
        .values({ ...input, userId: context.user.id })
        .returning();

      invariant(message, "could not create message");

      const sender = await db.query.user.findFirst({
        where: orm.eq(schema.user.id, context.user.id),
      });

      invariant(sender, "could not find sender");

      const publisher = new DurablePublisher<{
        sent: z.infer<typeof MessageSelectSchemaWithSender>;
      }>(context.env.CLOUDFLARE_DO);

      publisher.publish("sent", {
        ...message,
        sender,
      });

      return message;
    }),

  list: os
    .use(authMiddleware)
    .output(z.array(MessageSelectSchemaWithSender))
    .handler(async ({ context }) => {
      const db = createDatabase(context.env);

      const messages = await db.query.message.findMany({
        with: { sender: true },
        limit: 20,
        orderBy: orm.desc(schema.message.createdAt),
      });

      return messages.reverse();
    }),

  subscribe: os
    .use(authMiddleware)
    .output(eventIterator(MessageSelectSchemaWithSender))
    .handler(async function* ({ context }) {
      const publisher = new DurablePublisher<{
        sent: z.infer<typeof MessageSelectSchemaWithSender>;
      }>(context.env.CLOUDFLARE_DO);

      const iterator = publisher.subscribe("sent");

      for await (const message of iterator) {
        yield message as any;
      }
    }),
};
