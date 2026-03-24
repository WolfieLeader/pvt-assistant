import { z } from "zod";

export const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount required")
    .refine((v) => !Number.isNaN(Number.parseFloat(v)) && Number.parseFloat(v) > 0, "Must be a positive number"),
  title: z.string().trim().min(1, "Title required").max(200),
  categoryId: z.number().optional(),
  date: z.string().min(1),
  note: z.string().max(1000).optional(),
  isRecurring: z.boolean().default(false),
  subIntervalUnit: z.number().optional(),
  subIntervalValue: z.number().min(1).max(4).optional(),
  subEndDate: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
