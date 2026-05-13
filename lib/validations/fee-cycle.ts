import { z } from "zod";

export const feeCycleSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2024).max(2100),
  notes: z.string().optional().default("")
});

export type FeeCycleSchemaInput = z.input<typeof feeCycleSchema>;
export type FeeCycleInput = z.output<typeof feeCycleSchema>;
