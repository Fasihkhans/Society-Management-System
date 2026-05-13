import { z } from "zod";

export const houseSchema = z.object({
  streetId: z.string().min(1, "Street is required."),
  houseNumber: z.string().min(1, "House number is required."),
  ownerName: z.string().min(2, "Owner name is required."),
  cnic: z.string().min(5, "CNIC is required."),
  mobile: z.string().min(5, "Mobile number is required."),
  ownerEmail: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  monthlyFeeAmount: z.coerce.number().min(1, "Monthly fee must be greater than zero."),
  openingBalance: z.coerce.number().min(0, "Opening balance cannot be negative."),
  notes: z.string().optional().default("")
});

export type HouseSchemaInput = z.input<typeof houseSchema>;
export type HouseInput = z.output<typeof houseSchema>;
