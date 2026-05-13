import { z } from "zod";

export const residentSchema = z.object({
  houseId: z.string().min(1, "Select a house."),
  fullName: z.string().min(2, "Resident name is required."),
  residentType: z.enum(["OWNER", "TENANT"]),
  cnic: z.string().min(5, "CNIC is required."),
  mobile: z.string().min(5, "Mobile number is required."),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  isPrimary: z.boolean().default(false)
});

export type ResidentSchemaInput = z.input<typeof residentSchema>;
export type ResidentInput = z.output<typeof residentSchema>;
