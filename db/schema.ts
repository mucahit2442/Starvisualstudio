import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const storeState = sqliteTable('store_state', {
 id: integer('id').primaryKey(), payload: text('payload').notNull(), revision: integer('revision').notNull().default(1), updatedAt: text('updated_at').notNull()
});
