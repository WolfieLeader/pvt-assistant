import { sql } from "drizzle-orm";
import { integer as int, sqliteTable, text as str } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const categories = sqliteTable("categories", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: str("name").notNull(),
  parentId: int("parent_id").references((): any => categories.id),
  icon: str("icon").notNull(),
  color: str("color"),
});

export const expenses = sqliteTable("expenses", {
  id: str("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: str("title").notNull(),
  note: str("note"),
  amount: int("amount").notNull(),
  categoryId: int("category_id").references(() => categories.id),
  date: str("date").default(sql`(date('now'))`),
  subIntervalUnit: int("sub_interval_unit"),
  subIntervalValue: int("sub_interval_value"),
  subEndDate: str("sub_end_date"),
  createdAt: int("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: int("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const tasks = sqliteTable("tasks", {
  id: str("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: str("title").notNull(),
  note: str("note"),
  isDone: int("is_done", { mode: "boolean" }).default(false).notNull(),
  priority: int("priority").default(2).notNull(),
  categoryId: int("category_id").references(() => categories.id),
  dueDate: str("due_date"),
  reminderAt: int("reminder_at"),
  createdAt: int("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: int("updated_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const attachments = sqliteTable("attachments", {
  id: str("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  expenseId: str("expense_id")
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  filePath: str("file_path").notNull(),
  mimeType: str("mime_type").notNull(),
  fileName: str("file_name").notNull(),
  createdAt: int("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
