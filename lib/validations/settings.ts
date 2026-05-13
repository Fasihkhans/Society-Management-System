import { z } from "zod";

export const settingsSchema = z.object({
  societyName: z.string().min(2, "Society name is required."),
  receiptPrefix: z.string().min(2, "Receipt prefix is required."),
  defaultDueDay: z.coerce.number().int().min(1).max(28),
  supportPhone: z.string().min(5, "Support phone is required."),
  viewerNotice: z.string().min(10, "Viewer notice should be meaningful.")
});

export type SettingsSchemaInput = z.input<typeof settingsSchema>;
export type SettingsInput = z.output<typeof settingsSchema>;
