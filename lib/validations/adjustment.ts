import { z } from "zod";

export const adjustmentSchema = z.object({
  houseId: z.string().min(1, "Select a house."),
  feeDueId: z.string().optional(),
  amount: z.coerce.number().refine((value) => value !== 0, "Amount cannot be zero."),
  reason: z.string().min(5, "Reason is required.")
});

export type AdjustmentSchemaInput = z.input<typeof adjustmentSchema>;
export type AdjustmentInput = z.output<typeof adjustmentSchema>;
