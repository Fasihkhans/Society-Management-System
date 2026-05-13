import { z } from "zod";

export const paymentSchema = z.object({
  feeDueId: z.string().min(1, "Select a due record."),
  amountReceived: z.coerce.number().positive("Amount must be greater than zero."),
  paymentDate: z.string().min(1, "Payment date is required."),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "EASYPAISA", "JAZZCASH", "OTHER"]),
  notes: z.string().optional().default("")
});

export type PaymentSchemaInput = z.input<typeof paymentSchema>;
export type PaymentInput = z.output<typeof paymentSchema>;
