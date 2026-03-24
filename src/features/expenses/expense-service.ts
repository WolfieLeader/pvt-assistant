import { eq, and, gte, lte, like, sql, desc, sum, count } from "drizzle-orm";
import { db } from "~/db/client";
import { expenses, categories } from "~/db/schema";

export async function createExpense(data: {
  title: string;
  note?: string | null;
  amount: number;
  categoryId?: number | null;
  date?: string;
  subIntervalUnit?: number | null;
  subIntervalValue?: number | null;
  subEndDate?: string | null;
}) {
  const [row] = await db.insert(expenses).values(data).returning();
  return row;
}

export async function getExpense(id: string) {
  const rows = await db
    .select({
      expense: expenses,
      category: {
        name: categories.name,
        icon: categories.icon,
        color: categories.color,
        parentId: categories.parentId,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(eq(expenses.id, id));

  if (!rows.length) return null;

  const { expense, category } = rows[0];

  let color = category?.color ?? null;
  if (category?.parentId && !color) {
    const [parent] = await db
      .select({ color: categories.color })
      .from(categories)
      .where(eq(categories.id, category.parentId));
    color = parent?.color ?? null;
  }

  return {
    ...expense,
    category: category ? { name: category.name, icon: category.icon, color } : null,
  };
}

export async function updateExpense(
  id: string,
  data: Partial<{
    title: string;
    note: string | null;
    amount: number;
    categoryId: number | null;
    date: string;
    subIntervalUnit: number | null;
    subIntervalValue: number | null;
    subEndDate: string | null;
  }>,
) {
  const [row] = await db
    .update(expenses)
    .set({ ...data, updatedAt: Date.now() })
    .where(eq(expenses.id, id))
    .returning();
  return row;
}

export async function deleteExpense(id: string) {
  await db.delete(expenses).where(eq(expenses.id, id));
}

export async function listExpenses(filters: {
  startDate?: string;
  endDate?: string;
  search?: string;
  categoryId?: number;
}) {
  const conditions = [];
  if (filters.startDate) conditions.push(gte(expenses.date, filters.startDate));
  if (filters.endDate) conditions.push(lte(expenses.date, filters.endDate));
  if (filters.search) conditions.push(like(expenses.title, `%${filters.search}%`));
  if (filters.categoryId) conditions.push(eq(expenses.categoryId, filters.categoryId));

  const rows = await db
    .select({
      expense: expenses,
      category: {
        name: categories.name,
        icon: categories.icon,
        color: categories.color,
        parentId: categories.parentId,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(expenses.date), desc(expenses.createdAt));

  const parentIds = [...new Set(rows.map((r) => r.category?.parentId).filter((id): id is number => id != null))];

  let parentColors: Record<number, string | null> = {};
  if (parentIds.length) {
    const parents = await db
      .select({ id: categories.id, color: categories.color })
      .from(categories)
      .where(
        parentIds.length === 1
          ? eq(categories.id, parentIds[0])
          : sql`${categories.id} IN (${sql.join(
              parentIds.map((id) => sql`${id}`),
              sql`, `,
            )})`,
      );
    parentColors = Object.fromEntries(parents.map((p) => [p.id, p.color]));
  }

  return rows.map(({ expense, category }) => ({
    ...expense,
    category: category
      ? {
          name: category.name,
          icon: category.icon,
          color: category.color ?? (category.parentId ? (parentColors[category.parentId] ?? null) : null),
        }
      : null,
  }));
}

export async function getTodayTotal(): Promise<number> {
  const [row] = await db
    .select({ total: sum(expenses.amount) })
    .from(expenses)
    .where(eq(expenses.date, sql`date('now')`));
  return Number(row?.total ?? 0);
}

export async function getExpenseStats(period: "day" | "week" | "month") {
  let startExpr;
  if (period === "day") {
    startExpr = sql`date('now')`;
  } else if (period === "week") {
    startExpr = sql`date('now', 'weekday 0', '-6 days')`;
  } else {
    startExpr = sql`date('now', 'start of month')`;
  }

  const [row] = await db
    .select({
      total: sum(expenses.amount),
      count: count(),
    })
    .from(expenses)
    .where(and(gte(expenses.date, startExpr), lte(expenses.date, sql`date('now')`)));

  return {
    total: Number(row?.total ?? 0),
    count: Number(row?.count ?? 0),
  };
}
