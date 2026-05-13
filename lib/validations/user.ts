import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["ADMIN", "STREET_REP"]),
  assignedStreetId: z.string().optional().or(z.literal(""))
});

export type UserSchemaInput = z.input<typeof userSchema>;
export type UserInput = z.output<typeof userSchema>;
