import { z } from "zod";

export const streetSchema = z.object({
  number: z.string().min(1, "Street number is required."),
  name: z.string().min(1, "Street name is required."),
  notes: z.string().optional().default("")
});

export type StreetSchemaInput = z.input<typeof streetSchema>;
export type StreetInput = z.output<typeof streetSchema>;
