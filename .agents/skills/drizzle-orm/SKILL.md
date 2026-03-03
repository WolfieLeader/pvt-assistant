---
name: drizzle-orm
description: Drizzle ORM patterns for SQLite — schema definition, migrations, queries, relations, and Zod validation. Use when working with database schemas, queries, migrations, or data models.
---

# Drizzle ORM (SQLite)

## References

Consult these resources as needed:

```
references/
  llms-full.md    Complete Drizzle ORM documentation (SQLite-focused)
```

## Project Setup

Driver: `expo-sqlite` + `drizzle-orm/expo-sqlite`

```typescript
// src/db/client.ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

const expoDb = openDatabaseSync("db.db");
expoDb.execSync("PRAGMA foreign_keys = ON");
export const db = drizzle(expoDb, { schema });
```

Config: `drizzle.config.ts` — `{ dialect: "sqlite", driver: "expo", schema: "./src/db/schema.ts", out: "./drizzle" }`

Migrations: `useMigrations(db, migrations)` from `drizzle-orm/expo-sqlite/migrator`

Metro: add `'sql'` to `config.resolver.sourceExts`; Babel: `["inline-import", { extensions: [".sql"] }]`

## Quick Reference

### Schema Definition

```typescript
import { integer as int, sqliteTable, text as str } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: str().notNull(),
    email: str().notNull().unique(),
    role: str().$type<"admin" | "user">().default("user"),
    data: str({ mode: "json" }).$type<{ foo: string }>(),
    isActive: int({ mode: "boolean" }).default(true).notNull(),
    createdAt: int().$defaultFn(() => Date.now()),
  },
  (t) => [index("email_idx").on(t.email), uniqueIndex("name_email_idx").on(t.name, t.email)],
);
```

Column types: `integer()` (number | boolean | timestamp | timestamp_ms), `text()` (string | json | enum), `real()`, `blob()` (buffer | bigint | json), `numeric()`

Modifiers: `.primaryKey()`, `.notNull()`, `.default(v)`, `.unique()`, `.references(() => t.col)`, `.$defaultFn()`, `.$onUpdateFn()`, `.$type<T>()`

### Relations

```typescript
import { relations } from "drizzle-orm";

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
}));
```

Disambiguation: `relationName: "author"` when multiple relations to same table.

Many-to-many: explicit junction table + `one()` from both sides of the junction.

### Queries (CRUD)

```typescript
import { eq, and, or, gt, lt, like, inArray, isNull, desc, asc, sql, count } from "drizzle-orm";

// Select
await db.select().from(users).where(eq(users.id, 1));
await db.select({ id: users.id, name: users.name }).from(users);
await db.selectDistinct().from(users);

// Insert
await db.insert(users).values({ name: "Dan" });
await db.insert(users).values([{ name: "A" }, { name: "B" }]);
await db.insert(users).values({ name: "Dan" }).returning();
await db
  .insert(users)
  .values({ id: 1, name: "Dan" })
  .onConflictDoUpdate({ target: users.id, set: { name: "Dan" } });

// Update
await db.update(users).set({ name: "Mr. Dan" }).where(eq(users.id, 1)).returning();

// Delete
await db.delete(users).where(eq(users.id, 1)).returning();
```

### Relational Queries

```typescript
// Pass { schema } to drizzle() to enable db.query
await db.query.users.findMany({
  columns: { id: true, name: true },
  where: (users, { eq }) => eq(users.id, 1),
  with: { posts: { with: { comments: true }, limit: 5 } },
  orderBy: (users, { desc }) => [desc(users.createdAt)],
  limit: 10,
  offset: 0,
  extras: { count: sql<number>`count(*)`.as("count") },
});
await db.query.users.findFirst({ where: eq(users.id, 1) });
```

### Joins

```typescript
await db.select().from(users).leftJoin(posts, eq(users.id, posts.authorId));
// Also: .innerJoin(), .rightJoin(), .fullJoin(), .crossJoin()
```

### Aggregations

```typescript
import { count, sum, avg, min, max } from "drizzle-orm";
await db.select({ total: count() }).from(users);
await db.$count(users, eq(users.name, "Dan"));
```

### Transactions

```typescript
await db.transaction(
  async (tx) => {
    await tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} - 100` })
      .where(eq(accounts.id, 1));
    await tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} + 100` })
      .where(eq(accounts.id, 2));
    // tx.rollback() to abort
  },
  { behavior: "immediate" },
); // "deferred" | "immediate" | "exclusive"
```

### Zod Validation

```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-orm/zod";

const insertUserSchema = createInsertSchema(users, {
  name: (s) => s.max(100),
  email: (s) => s.email(),
});
const selectUserSchema = createSelectSchema(users);
const updateUserSchema = createUpdateSchema(users);
```

### Type Inference

```typescript
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

### Migrations

```bash
npx drizzle-kit generate   # Generate SQL migration files
npx drizzle-kit migrate    # Apply migrations via CLI
npx drizzle-kit push       # Push schema directly (dev)
npx drizzle-kit pull       # Introspect DB -> schema
npx drizzle-kit studio     # Visual DB explorer
```

Runtime migrations (Expo):

```typescript
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../drizzle/migrations";

const { success, error } = useMigrations(db, migrations);
```

### Indexes & Constraints

```typescript
import { index, uniqueIndex, primaryKey, foreignKey, unique, check } from "drizzle-orm/sqlite-core";

// Third arg of sqliteTable:
(t) => [
  index("idx").on(t.col),
  uniqueIndex("uidx").on(t.col),
  primaryKey({ columns: [t.a, t.b] }),
  foreignKey({ columns: [t.fk], foreignColumns: [other.id] }).onDelete("cascade"),
  unique().on(t.a, t.b),
  check("age_check", sql`${t.age} > 0`),
];
```
