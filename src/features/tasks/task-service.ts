import { and, asc, count, desc, eq, gte, gt, sql } from "drizzle-orm";
import { db } from "~/db/client";
import { categories, tasks } from "~/db/schema";

const parentCategory = db
  .select({
    id: categories.id,
    color: categories.color,
  })
  .from(categories)
  .as("parent_cat");

function withCategoryJoin() {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      note: tasks.note,
      isDone: tasks.isDone,
      priority: tasks.priority,
      categoryId: tasks.categoryId,
      dueDate: tasks.dueDate,
      reminderAt: tasks.reminderAt,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: sql<string | null>`COALESCE(${categories.color}, ${parentCategory.color})`,
    })
    .from(tasks)
    .leftJoin(categories, eq(tasks.categoryId, categories.id))
    .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id));
}

function today() {
  return new Date().toISOString().split("T")[0]!;
}

export async function createTask(data: typeof tasks.$inferInsert) {
  const [row] = await db.insert(tasks).values(data).returning();
  return row!;
}

export async function getTask(id: string) {
  const [row] = await withCategoryJoin().where(eq(tasks.id, id));
  return row ?? null;
}

export async function updateTask(id: string, data: Partial<Omit<typeof tasks.$inferInsert, "id">>) {
  const [row] = await db
    .update(tasks)
    .set({ ...data, updatedAt: Date.now() })
    .where(eq(tasks.id, id))
    .returning();
  return row ?? null;
}

export async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
}

export async function toggleTaskDone(id: string) {
  const [task] = await db.select({ isDone: tasks.isDone }).from(tasks).where(eq(tasks.id, id));
  if (!task) return null;
  const [updated] = await db
    .update(tasks)
    .set({ isDone: !task.isDone, updatedAt: Date.now() })
    .where(eq(tasks.id, id))
    .returning();
  return updated!;
}

export async function listTasks(filter: "all" | "today" | "upcoming" | "done" = "all") {
  const d = today();
  const base = withCategoryJoin();

  switch (filter) {
    case "all":
      return base
        .where(eq(tasks.isDone, false))
        .orderBy(
          desc(tasks.priority),
          asc(sql`CASE WHEN ${tasks.dueDate} IS NULL THEN 1 ELSE 0 END`),
          asc(tasks.dueDate),
        );
    case "today":
      return base.where(and(eq(tasks.isDone, false), eq(tasks.dueDate, d)));
    case "upcoming":
      return base.where(and(eq(tasks.isDone, false), gt(tasks.dueDate, d))).orderBy(asc(tasks.dueDate));
    case "done":
      return base.where(eq(tasks.isDone, true)).orderBy(desc(tasks.updatedAt));
  }
}

export async function getPendingCount() {
  const [row] = await db.select({ value: count() }).from(tasks).where(eq(tasks.isDone, false));
  return row?.value ?? 0;
}

export async function getUpcomingTasks(limit = 5) {
  return withCategoryJoin()
    .where(and(eq(tasks.isDone, false), gte(tasks.dueDate, today())))
    .orderBy(asc(tasks.dueDate))
    .limit(limit);
}
