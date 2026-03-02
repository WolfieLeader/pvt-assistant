import { z } from "zod";
import { zCents, zId, zInt, zIntervals, zNote, zPriority, zStr, zText, zTitle } from "~/utils/zod";

// ── Insert schemas (form validation) ──

export const zInsertExpense = z.object({
  id: zId,
  title: zTitle,
  note: zNote,
  amount: zCents,
  categoryId: zInt.optional(),
  date: zStr.optional(),
  subIntervalUnit: zInt.optional(),
  subIntervalValue: zIntervals,
  subEndDate: zStr.optional(),
});

export const zInsertTask = z.object({
  id: zId,
  title: zTitle,
  note: zNote,
  isDone: z.boolean().default(false),
  priority: zPriority,
  categoryId: zInt.optional(),
  dueDate: zStr.optional(),
  reminderAt: z.number().optional(),
});

export const zInsertAttachment = z.object({
  id: zId,
  expenseId: zText,
  filePath: zText,
  mimeType: zText,
  fileName: zText,
});

// ── Extraction schemas (LLM output parsing) ──

export const zExtractExpense = z.object({
  title: zText,
  note: zStr.optional(),
  amount: zCents,
  categoryName: zStr.optional(),
  date: zStr.optional(),
  subIntervalUnit: zInt.optional(),
  subIntervalValue: zIntervals,
  subEndDate: zStr.optional(),
});

export const zExtractTask = z.object({
  title: zText,
  note: zStr.optional(),
  priority: zInt.min(1).max(3).optional(),
  categoryName: zStr.optional(),
  dueDate: zStr.optional(),
  reminderAt: zStr.optional(),
});

// ── Inferred types ──

export type InsertExpense = z.infer<typeof zInsertExpense>;
export type InsertTask = z.infer<typeof zInsertTask>;
export type InsertAttachment = z.infer<typeof zInsertAttachment>;
export type ExtractExpense = z.infer<typeof zExtractExpense>;
export type ExtractTask = z.infer<typeof zExtractTask>;
