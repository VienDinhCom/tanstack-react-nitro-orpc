import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { user } from "@/backend/database/schema";

export const UserSelectSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user);
export const UserUpdateSchema = createUpdateSchema(user);
