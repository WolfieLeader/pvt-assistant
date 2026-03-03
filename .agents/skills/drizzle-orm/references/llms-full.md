# Drizzle ORM — SQLite Complete Reference

## Expo SQLite Setup

### Required Dependencies

- `expo-sqlite`: Database access library
- `drizzle-orm`: ORM functionality
- `drizzle-kit`: Migration and code generation tools (dev)
- `babel-plugin-inline-import`: Inline SQL file imports for migrations (dev)

### Metro Configuration (`metro.config.js`)

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");
module.exports = config;
```

### Babel Configuration (`babel.config.js`)

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["inline-import", { extensions: [".sql"] }]],
  };
};
```

### Drizzle Configuration (`drizzle.config.ts`)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
```

### Database Connection

```typescript
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const expo = SQLite.openDatabaseSync("db.db");
expo.execSync("PRAGMA foreign_keys = ON");
export const db = drizzle(expo, { schema });
```

### Runtime Migrations

```typescript
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./drizzle/migrations";

const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
    // DB is ready
  }, [success]);
}
```

---

## Schema Declaration

### Table Definition

SQLite tables are defined using `sqliteTable` from `drizzle-orm/sqlite-core`:

```typescript
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

### Column Declaration Styles

**Direct imports:**

```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
});
```

**Callback pattern:**

```typescript
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", (t) => ({
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  age: t.integer().notNull(),
  email: t.text().notNull().unique(),
}));
```

**Namespace import:**

```typescript
import * as s from "drizzle-orm/sqlite-core";

export const usersTable = s.sqliteTable("users", {
  id: s.integer().primaryKey({ autoIncrement: true }),
  name: s.text().notNull(),
});
```

### Column Aliasing

```typescript
export const users = sqliteTable("users", {
  id: integer(),
  firstName: text("first_name"),
});
```

### Schema Organization

**Single file:** `schema: './src/db/schema.ts'`

**Multiple files:**

```
src/db/schema/
  users.ts
  posts.ts
  comments.ts
```

Config: `schema: './src/db/schema'` — Drizzle recursively discovers all exports.

### Reusable Column Patterns

```typescript
const timestamps = {
  createdAt: integer().$defaultFn(() => Date.now()),
  updatedAt: integer().$defaultFn(() => Date.now()),
};

export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  ...timestamps,
});
```

### Type Inference

```typescript
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

### Enum-like behavior

```typescript
export const users = sqliteTable("users", {
  role: text().$type<"guest" | "user" | "admin">().default("guest"),
});
```

---

## Column Types

### Integer

Signed integers stored in 0, 1, 2, 3, 4, 6, or 8 bytes.

```typescript
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  id: integer(),
});

// Modes
integer({ mode: "number" }); // default — JS number
integer({ mode: "boolean" }); // stores 0/1, returns boolean
integer({ mode: "timestamp_ms" }); // ms since epoch -> Date
integer({ mode: "timestamp" }); // seconds since epoch -> Date
```

Auto-increment primary key:

```typescript
integer({ mode: "number" }).primaryKey({ autoIncrement: true });
```

### Real

Floating-point values (8-byte IEEE).

```typescript
import { real, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  price: real(),
});
```

### Text

Text strings (UTF-8/UTF-16). Supports enum and JSON modes.

```typescript
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  name: text(),
});

// Enum inference (no runtime validation)
text({ enum: ["value1", "value2"] });

// JSON mode
text({ mode: "json" });
text({ mode: "json" }).$type<{ foo: string }>();
```

### Blob

Binary data stored exactly as input.

```typescript
import { blob, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  data: blob(),
});

blob(); // default
blob({ mode: "buffer" }); // Buffer
blob({ mode: "bigint" }); // BigInt
blob({ mode: "json" }); // JSON (prefer text({ mode: 'json' }) instead)
```

### Numeric

```typescript
import { numeric, sqliteTable } from "drizzle-orm/sqlite-core";

const table = sqliteTable("table", {
  value: numeric(),
  valueNum: numeric({ mode: "number" }),
  valueBig: numeric({ mode: "bigint" }),
});
```

### Boolean (via integer)

SQLite has no native boolean. Use integer with boolean mode:

```typescript
const table = sqliteTable("table", {
  isActive: integer({ mode: "boolean" }),
});
```

### Custom Types with $type

```typescript
type UserId = number & { __brand: "user_id" };

const users = sqliteTable("users", {
  id: integer().$type<UserId>().primaryKey(),
  data: blob().$type<{ foo: string }>(),
});
```

---

## Column Modifiers

### Not Null

```typescript
integer().notNull();
```

### Default Values

```typescript
import { sql } from "drizzle-orm";

integer().default(42);
integer().default(sql`(abs(42))`);

// Special SQL defaults
text().default(sql`(CURRENT_TIME)`);
text().default(sql`(CURRENT_DATE)`);
text().default(sql`(CURRENT_TIMESTAMP)`);
```

### Runtime Defaults with $defaultFn

```typescript
import { createId } from "@paralleldrive/cuid2";

text().$defaultFn(() => createId());
```

Only affects drizzle-orm runtime, not drizzle-kit migrations.

### Update Functions with $onUpdateFn

```typescript
text()
  .$type<string | null>()
  .$onUpdate(() => null);
```

Runs on row updates. If no default is provided, also runs on inserts.

---

## Indexes & Constraints

### Primary Key

```typescript
export const user = sqliteTable("user", {
  id: integer("id").primaryKey(),
});
```

### Composite Primary Key

```typescript
import { primaryKey, sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const bookToAuthor = sqliteTable(
  "book_to_author",
  {
    authorId: integer("author_id"),
    bookId: integer("book_id"),
  },
  (table) => [primaryKey({ columns: [table.bookId, table.authorId] })],
);
```

### Foreign Keys

```typescript
export const book = sqliteTable("book", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  authorId: integer("author_id").references(() => user.id),
});
```

Self-referencing:

```typescript
import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

parentId: integer("parent_id").references((): AnySQLiteColumn => user.id);
```

Multi-column:

```typescript
import { foreignKey } from "drizzle-orm/sqlite-core";

(table) => [
  foreignKey({
    columns: [table.userFirstName, table.userLastName],
    foreignColumns: [user.firstName, user.lastName],
  }),
];
```

Foreign key actions:

```typescript
integer("author_id").references(() => users.id, { onDelete: "cascade" });
// Actions: 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default'
```

### Unique Constraints

```typescript
import { unique } from "drizzle-orm/sqlite-core";

// Single column
integer('id').unique()

// Composite
(t) => [
  unique().on(t.id, t.name),
  unique('custom_name').on(t.id, t.name),
]
```

### Check Constraints

```typescript
import { check } from "drizzle-orm/sqlite-core";

(table) => [check("age_check", sql`${table.age} > 21`)];
```

### Indexes

```typescript
import { index, uniqueIndex } from "drizzle-orm/sqlite-core";

(table) => [index("name_idx").on(table.name), uniqueIndex("email_idx").on(table.email)];
```

---

## Relations

Relations are application-level abstractions, not database constraints. They don't affect schema — use with or without foreign keys.

### Defining Relations

```typescript
import { relations } from "drizzle-orm";
```

**one()** — one-to-one or many-to-one
**many()** — one-to-many or many-to-many

### One-to-One

```typescript
export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  name: text(),
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profileInfo),
}));

export const profileInfo = sqliteTable("profile_info", {
  id: integer().primaryKey(),
  userId: integer().references(() => users.id),
  bio: text(),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, {
    fields: [profileInfo.userId],
    references: [users.id],
  }),
}));
```

When FK is in the related table, the relation type is nullable.

### One-to-Many

```typescript
export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  name: text(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = sqliteTable("posts", {
  id: integer().primaryKey(),
  content: text(),
  authorId: integer(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### Many-to-Many (Junction Table)

```typescript
export const users = sqliteTable("users", {
  id: integer().primaryKey(),
  name: text(),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = sqliteTable("groups", {
  id: integer().primaryKey(),
  name: text(),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = sqliteTable(
  "users_to_groups",
  {
    userId: integer()
      .notNull()
      .references(() => users.id),
    groupId: integer()
      .notNull()
      .references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, { fields: [usersToGroups.groupId], references: [groups.id] }),
  user: one(users, { fields: [usersToGroups.userId], references: [users.id] }),
}));
```

### Disambiguating Relations

When multiple relations exist between the same tables, use `relationName`:

```typescript
export const usersRelations = relations(users, ({ many }) => ({
  authored: many(posts, { relationName: "author" }),
  reviewed: many(posts, { relationName: "reviewer" }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "author",
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
}));
```

---

## SELECT Queries

### Basic Select

```typescript
const result = await db.select().from(users);
```

### Partial Select

```typescript
const result = await db
  .select({
    id: users.id,
    name: users.name,
  })
  .from(users);
```

With SQL expressions:

```typescript
const result = await db
  .select({
    id: users.id,
    lowerName: sql<string>`lower(${users.name})`,
  })
  .from(users);
```

### Conditional Select

```typescript
async function selectUsers(withName: boolean) {
  return db
    .select({
      id: users.id,
      ...(withName ? { name: users.name } : {}),
    })
    .from(users);
}
```

### Distinct

```typescript
await db.selectDistinct().from(users).orderBy(users.id, users.name);
```

### getColumns Helper

```typescript
import { getColumns } from "drizzle-orm";

// All columns plus computed
await db
  .select({
    ...getColumns(posts),
    titleLength: sql<number>`length(${posts.title})`,
  })
  .from(posts);

// Exclude columns
const { content, ...rest } = getColumns(posts);
await db.select({ ...rest }).from(posts);
```

---

## WHERE Clause & Filters

### Basic Operators

```typescript
import { eq, lt, lte, gt, gte, ne } from "drizzle-orm";

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
```

All values are automatically parameterized.

### Custom SQL Filters

```typescript
import { sql } from "drizzle-orm";

await db
  .select()
  .from(users)
  .where(sql`${users.id} < 42`);
await db
  .select()
  .from(users)
  .where(sql`lower(${users.name}) = 'aaron'`);
```

### Inverting Conditions

```typescript
import { not } from "drizzle-orm";
await db
  .select()
  .from(users)
  .where(not(eq(users.id, 42)));
```

### Combining Filters

```typescript
import { and, or } from "drizzle-orm";

await db
  .select()
  .from(users)
  .where(and(eq(users.id, 42), eq(users.name, "Dan")));

await db
  .select()
  .from(users)
  .where(or(eq(users.id, 42), eq(users.name, "Dan")));
```

### Conditional Filtering

```typescript
const searchPosts = async (term?: string) => {
  await db
    .select()
    .from(posts)
    .where(term ? like(posts.title, term) : undefined);
};

const searchPosts = async (filters: SQL[]) => {
  await db
    .select()
    .from(posts)
    .where(and(...filters));
};
```

### All Operators

- `eq(column, value)` — Equality
- `ne(column, value)` — Not equal
- `lt(column, value)` — Less than
- `lte(column, value)` — Less than or equal
- `gt(column, value)` — Greater than
- `gte(column, value)` — Greater than or equal
- `like(column, pattern)` — SQL LIKE
- `ilike(column, pattern)` — Case-insensitive LIKE
- `between(column, min, max)` — Range check
- `inArray(column, values)` — Value in array
- `notInArray(column, values)` — Value not in array
- `isNull(column)` — NULL check
- `isNotNull(column)` — NOT NULL check
- `exists(subquery)` — Existence check
- `not(condition)` — Negate
- `and(...conditions)` — Combine with AND
- `or(...conditions)` — Combine with OR

---

## Pagination & Ordering

### Limit & Offset

```typescript
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

### Order By

```typescript
import { asc, desc } from "drizzle-orm";

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
await db.select().from(users).orderBy(asc(users.name), desc(users.name2));
```

### Cursor-based Pagination

```typescript
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
```

---

## Aggregations

### Manual with GROUP BY

```typescript
await db
  .select({
    age: users.age,
    count: sql<number>`cast(count(${users.id}) as int)`,
  })
  .from(users)
  .groupBy(users.age);

// With HAVING
await db
  .select({
    age: users.age,
    count: sql<number>`cast(count(${users.id}) as int)`,
  })
  .from(users)
  .groupBy(users.age)
  .having(({ count }) => gt(count, 1));
```

### Helpers

```typescript
import { count, countDistinct, sum, sumDistinct, avg, avgDistinct, max, min } from "drizzle-orm";

await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);
await db.select({ value: countDistinct(users.id) }).from(users);
await db.select({ value: sum(users.id) }).from(users);
await db.select({ value: avg(users.id) }).from(users);
await db.select({ value: max(users.id) }).from(users);
await db.select({ value: min(users.id) }).from(users);
```

### $count Utility

```typescript
const count = await db.$count(users);
const count = await db.$count(users, eq(users.name, "Dan"));

// In subqueries
const result = await db
  .select({
    ...users,
    postsCount: db.$count(posts, eq(posts.authorId, users.id)),
  })
  .from(users);
```

---

## Subqueries & CTEs

### Subqueries

```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as("sq");
const result = await db.select().from(sq);
```

In joins:

```typescript
const sq = db.select().from(users).where(eq(users.id, 42)).as("sq");
const result = await db.select().from(users).leftJoin(sq, eq(users.id, sq.id));
```

### WITH Clause (CTEs)

```typescript
const sq = db.$with("sq").as(db.select().from(users).where(eq(users.id, 42)));
const result = await db.with(sq).select().from(sq);
```

With INSERT/UPDATE/DELETE:

```typescript
const sq = db.$with("sq").as(db.insert(users).values({ name: "John" }).returning());
const result = await db.with(sq).select().from(sq);
```

For computed fields in CTEs:

```typescript
const sq = db.$with("sq").as(
  db
    .select({
      name: sql<string>`upper(${users.name})`.as("name"),
    })
    .from(users),
);
```

---

## Iterator (Large Result Sets)

```typescript
const iterator = await db.select().from(users).iterator();

for await (const row of iterator) {
  console.log(row);
}
```

---

## INSERT Operations

### Basic Insert

```typescript
await db.insert(users).values({ name: "Andrew" });
```

### Type-safe Insert

```typescript
type NewUser = typeof users.$inferInsert;

const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
};
```

### Insert Multiple Rows

```typescript
await db.insert(users).values([{ name: "Andrew" }, { name: "Dan" }]);
```

### Insert with RETURNING

```typescript
await db.insert(users).values({ name: "Dan" }).returning();

// Partial return
await db.insert(users).values({ name: "Dan" }).returning({ insertedId: users.id });
```

### Upserts (On Conflict)

**Do Nothing:**

```typescript
await db.insert(users).values({ id: 1, name: "John" }).onConflictDoNothing();

await db.insert(users).values({ id: 1, name: "John" }).onConflictDoNothing({ target: users.id });
```

**Do Update:**

```typescript
await db
  .insert(users)
  .values({ id: 1, name: "Dan" })
  .onConflictDoUpdate({ target: users.id, set: { name: "John" } });
```

With where clause:

```typescript
await db
  .insert(employees)
  .values({ employeeId: 123, name: "John Doe" })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` },
  });
```

Composite key upserts:

```typescript
await db
  .insert(users)
  .values({ firstName: "John", lastName: "Doe" })
  .onConflictDoUpdate({
    target: [users.firstName, users.lastName],
    set: { firstName: "John1" },
  });
```

### Insert Into ... Select

```typescript
const insertedEmployees = await db
  .insert(employees)
  .select(db.select({ name: users.name }).from(users).where(eq(users.role, "employee")))
  .returning({ id: employees.id, name: employees.name });
```

---

## UPDATE Operations

### Basic Update

```typescript
await db.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
```

Values of `undefined` are ignored; pass `null` to set a column to NULL.

### SQL Expressions in Updates

```typescript
await db
  .update(users)
  .set({ updatedAt: sql`(strftime('%s','now'))` })
  .where(eq(users.name, "Dan"));
```

### Limit (SQLite)

```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```

### Order By (SQLite)

```typescript
await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));
```

### Returning

```typescript
const updatedUserId = await db
  .update(users)
  .set({ name: "Mr. Dan" })
  .where(eq(users.name, "Dan"))
  .returning({ updatedId: users.id });
```

### Update with FROM (SQLite)

```typescript
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, "Seattle"), eq(users.name, "John")));
```

---

## DELETE Operations

### Basic Delete

```typescript
await db.delete(users); // All rows
await db.delete(users).where(eq(users.name, "Dan")); // Conditional
```

### Limit (SQLite)

```typescript
await db.delete(users).where(eq(users.name, "Dan")).limit(2);
```

### Order By (SQLite)

```typescript
await db.delete(users).where(eq(users.name, "Dan")).orderBy(users.name);
```

### Returning

```typescript
const deleted = await db.delete(users).where(eq(users.name, "Dan")).returning();

const deletedIds = await db.delete(users).where(eq(users.name, "Dan")).returning({ deletedId: users.id });
```

---

## JOIN Operations

### Left Join

```typescript
const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId));
// Right table is nullable in result type
```

### Inner Join

```typescript
const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId));
```

### Right Join

```typescript
const result = await db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId));
```

### Full Join

```typescript
const result = await db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId));
// Both tables nullable in result type
```

### Cross Join

```typescript
const result = await db.select().from(users).crossJoin(pets);
```

### Partial Select in Joins

```typescript
await db
  .select({
    userId: users.id,
    petId: pets.id,
  })
  .from(users)
  .leftJoin(pets, eq(users.id, pets.ownerId));
// petId is number | null (from left join)
```

### Nested Select Objects

```typescript
await db
  .select({
    userId: users.id,
    userName: users.name,
    pet: {
      id: pets.id,
      name: pets.name,
    },
  })
  .from(users)
  .fullJoin(pets, eq(users.id, pets.ownerId));
// Entire pet object is nullable instead of individual fields
```

### Table Aliases (Self-Joins)

```typescript
import { alias } from "drizzle-orm";

const parent = alias(users, "parent");
const result = db.select().from(users).leftJoin(parent, eq(parent.id, users.parentId));
```

### Aggregating Join Results

```typescript
type User = typeof users.$inferSelect;
type Pet = typeof pets.$inferSelect;

const rows = db.select({ user: users, pet: pets }).from(users).leftJoin(pets, eq(users.id, pets.ownerId)).all();

const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>((acc, row) => {
  if (!acc[row.user.id]) acc[row.user.id] = { user: row.user, pets: [] };
  if (row.pet) acc[row.user.id].pets.push(row.pet);
  return acc;
}, {});
```

---

## Relational Queries API

Generates exactly one SQL statement per query. Requires passing `{ schema }` to `drizzle()`.

### Multiple Schema Files

```typescript
import * as schema1 from "./schema1";
import * as schema2 from "./schema2";
const db = drizzle(expo, { schema: { ...schema1, ...schema2 } });
```

### findMany

```typescript
const users = await db.query.users.findMany();
```

### findFirst

```typescript
const user = await db.query.users.findFirst();
// Appends LIMIT 1, returns single record or undefined
```

### Including Relations

```typescript
const posts = await db.query.posts.findMany({
  with: { comments: true },
});

// Nested
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: { comments: true },
    },
  },
});
```

### Partial Field Selection

Include specific columns:

```typescript
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: { comments: true },
});
```

Exclude columns:

```typescript
const posts = await db.query.posts.findMany({
  columns: { content: false },
});
```

Nested column selection:

```typescript
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: {
    comments: { columns: { authorId: false } },
  },
});
```

Relations-only (no base columns):

```typescript
const res = await db.query.users.findMany({
  columns: {},
  with: { posts: true },
});
```

### Filtering

With imported operators:

```typescript
import { eq } from "drizzle-orm";
const users = await db.query.users.findMany({
  where: eq(users.id, 1),
});
```

With callback:

```typescript
const users = await db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, 1),
});
```

Nested:

```typescript
await db.query.posts.findMany({
  where: (posts, { eq }) => eq(posts.id, 1),
  with: {
    comments: {
      where: (comments, { lt }) => lt(comments.createdAt, new Date()),
    },
  },
});
```

### Sorting

```typescript
import { desc, asc } from "drizzle-orm";

await db.query.posts.findMany({
  orderBy: [asc(posts.id)],
});

// Callback
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)],
});

// Nested
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)],
  with: {
    comments: {
      orderBy: (comments, { desc }) => [desc(comments.id)],
    },
  },
});
```

### Pagination

```typescript
await db.query.posts.findMany({
  limit: 5,
  offset: 2,
  with: {
    comments: { limit: 3 }, // offset not allowed in nested
  },
});
```

### Custom Fields (Extras)

```typescript
import { sql } from "drizzle-orm";

await db.query.users.findMany({
  extras: {
    loweredName: sql`lower(${users.name})`.as("lowered_name"),
  },
});

// Callback
await db.query.users.findMany({
  extras: (users, { sql }) => ({
    loweredName: sql`lower(${users.name})`.as("lowered_name"),
  }),
});
```

Always specify `.as("column_name")` for custom fields. Aggregations are not supported in extras.

### Prepared Statements (SQLite)

```typescript
const prepared = db.query.users
  .findMany({
    where: (users, { eq }) => eq(users.id, placeholder("id")),
    with: {
      posts: {
        where: (posts, { eq }) => eq(posts.id, placeholder("pid")),
      },
    },
  })
  .prepare();

const result = await prepared.execute({ id: 1, pid: 5 });
```

Placeholders work in where, limit, offset.

### Complete Example

```typescript
const result = await db.query.users.findMany({
  columns: { id: true, name: true },
  where: (users, { eq }) => eq(users.verified, true),
  limit: 10,
  offset: 0,
  orderBy: (users, { asc }) => [asc(users.id)],
  with: {
    posts: {
      columns: { id: true, content: true },
      where: (posts, { gt }) => gt(posts.createdAt, new Date(2024, 0)),
      limit: 5,
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      with: {
        comments: { columns: { id: true, content: true }, limit: 3 },
      },
    },
  },
  extras: {
    postCount: sql<number>`(SELECT COUNT(*) FROM posts WHERE author_id = users.id)`.as("post_count"),
  },
});
```

---

## Transactions

### Basic Transaction

```typescript
await db.transaction(async (tx) => {
  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} - 100` })
    .where(eq(accounts.id, 1));
  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} + 100` })
    .where(eq(accounts.id, 2));
});
```

### Nested Transactions (Savepoints)

```typescript
await db.transaction(async (tx) => {
  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} - 100` })
    .where(eq(users.name, "Dan"));

  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

### Rollback

```typescript
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, "Dan"));
  if (account.balance < 100) {
    tx.rollback(); // Throws, reverts all operations
  }
  await tx
    .update(accounts)
    .set({ balance: sql`${accounts.balance} - 100` })
    .where(eq(users.name, "Dan"));
});
```

### Return Values

```typescript
const newBalance = await db.transaction(async (tx) => {
  // ... operations
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, "Dan"));
  return account.balance;
});
```

### SQLite-Specific Config

```typescript
await db.transaction(
  async (tx) => {
    // ...
  },
  { behavior: "immediate" },
);

// behavior: 'deferred' | 'immediate' | 'exclusive'
// deferred  — default, begins with first DB access
// immediate — begins immediately
// exclusive — acquires exclusive lock
```

### Relational Queries in Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.query.users.findMany({ with: { accounts: true } });
});
```

---

## Zod Integration

As of drizzle-orm 0.30.0+, schema generation is built into core (no separate `drizzle-zod` package needed).

### Installation

```bash
bun add zod
```

### Select Schema

```typescript
import { createSelectSchema } from "drizzle-orm/zod";

const userSelectSchema = createSelectSchema(users);
```

### Insert Schema

```typescript
import { createInsertSchema } from "drizzle-orm/zod";

const userInsertSchema = createInsertSchema(users);
// Auto-generated IDs and optional fields are handled
```

### Update Schema

```typescript
import { createUpdateSchema } from "drizzle-orm/zod";

const userUpdateSchema = createUpdateSchema(users);
// All fields optional, generated columns excluded
```

### Refinement

With callbacks (extend):

```typescript
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20),
  bio: (schema) => schema.max(1000),
});
```

With Zod schemas (overwrite):

```typescript
import { z } from "zod";

const userSelectSchema = createSelectSchema(users, {
  preferences: z.object({ theme: z.string() }),
});
```

### Factory Functions

```typescript
import { createSchemaFactory } from "drizzle-orm/zod";

const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});
```

### SQLite-Specific Type Mappings

- `integer()` -> `z.number().int()`
- `integer({ mode: 'boolean' })` -> `z.boolean()`
- `text()` -> `z.string()`
- `text({ enum: [...] })` -> `z.enum([...])`
- `text({ mode: 'json' })` -> `z.union([z.string(), z.number(), z.boolean(), z.null(), z.record(z.any()), z.array(z.any())])`
- `real()` -> `z.number()`
- `blob({ mode: 'buffer' })` -> `z.custom<Buffer>((v) => v instanceof Buffer)`

---

## Migrations

### Workflow Options

1. **Generate + Migrate (recommended for production)**

   ```bash
   npx drizzle-kit generate   # Creates SQL files from schema diff
   npx drizzle-kit migrate    # Applies SQL files to DB
   ```

2. **Push (dev/prototyping)**

   ```bash
   npx drizzle-kit push       # Apply schema directly, no files
   ```

3. **Pull (DB-first)**

   ```bash
   npx drizzle-kit pull       # Introspect DB -> TypeScript schema
   ```

4. **Runtime (Expo apps)**

   ```typescript
   import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
   import migrations from "./drizzle/migrations";

   const { success, error } = useMigrations(db, migrations);
   ```

### Generated File Structure

```
drizzle/
  20242409125510_migration_name/
    snapshot.json
    migration.sql
```

### drizzle-kit Commands

```bash
npx drizzle-kit generate   # Create migration SQL files
npx drizzle-kit migrate    # Apply migrations
npx drizzle-kit push       # Push schema directly
npx drizzle-kit pull       # Introspect DB
npx drizzle-kit studio     # Visual DB explorer
npx drizzle-kit check      # Validate migrations for issues
npx drizzle-kit up         # Upgrade migration snapshots
```

### Configuration Options

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/db/schema.ts",
  out: "./drizzle",

  // Optional
  strict: true, // Enforce strict mode
  verbose: true, // Detailed logging
  breakpoints: true, // Enable breakpoint support
  tablesFilter: "*", // Filter specific tables

  migrations: {
    prefix: "timestamp", // Naming convention
    table: "__drizzle_migrations__", // Metadata table name
  },
});
```

### Multiple Config Files

```bash
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```
