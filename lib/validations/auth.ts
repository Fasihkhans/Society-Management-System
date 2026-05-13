import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const viewerVerificationSchema = z.object({
  houseNumber: z.string().min(1, "House number is required."),
  cnic: z.string().min(5, "CNIC is required."),
  mobile: z.string().min(5, "Mobile number is required.")
});

export type LoginSchemaInput = z.input<typeof loginSchema>;
export type LoginInput = z.output<typeof loginSchema>;
export type ViewerVerificationSchemaInput = z.input<typeof viewerVerificationSchema>;
export type ViewerVerificationInput = z.output<typeof viewerVerificationSchema>;
