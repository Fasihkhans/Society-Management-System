export type RoleName = "ADMIN" | "STREET_REP";

export type HouseStatus = "ACTIVE" | "INACTIVE";

export type ResidentType = "OWNER" | "TENANT";

export type DueStatus = "PAID" | "PARTIAL" | "PENDING";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "EASYPAISA"
  | "JAZZCASH"
  | "OTHER";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  assignedStreetId: string | null;
};

export type RoleRecord = {
  id: string;
  name: RoleName;
  description: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: RoleName;
  assignedStreetId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type StreetRecord = {
  id: string;
  number: string;
  name: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type HouseRecord = {
  id: string;
  streetId: string;
  houseNumber: string;
  ownerName: string;
  cnic: string;
  mobile: string;
  ownerEmail: string | null;
  status: HouseStatus;
  monthlyFeeAmount: number;
  openingBalance: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ResidentRecord = {
  id: string;
  houseId: string;
  fullName: string;
  residentType: ResidentType;
  cnic: string;
  mobile: string;
  email: string | null;
  isPrimary: boolean;
  verificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type MonthlyFeeCycleRecord = {
  id: string;
  month: number;
  year: number;
  title: string;
  notes: string;
  createdById: string;
  generatedAt: string;
};

export type FeeDueRecord = {
  id: string;
  cycleId: string;
  houseId: string;
  amountDue: number;
  openingBalance: number;
  totalDue: number;
  amountReceived: number;
  balanceRemaining: number;
  status: DueStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type PaymentRecord = {
  id: string;
  feeDueId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  collectedById: string;
  notes: string;
  createdAt: string;
  deletedAt: string | null;
};

export type ReceiptRecord = {
  id: string;
  paymentId: string;
  receiptNumber: string;
  balanceAfterPayment: number;
  createdAt: string;
};

export type BalanceAdjustmentRecord = {
  id: string;
  houseId: string;
  feeDueId: string | null;
  amount: number;
  reason: string;
  adjustedById: string;
  createdAt: string;
};

export type AuditLogRecord = {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: string;
  createdAt: string;
};

export type SocietySettingsRecord = {
  societyName: string;
  receiptPrefix: string;
  defaultDueDay: number;
  supportPhone: string;
  viewerNotice: string;
};

export type DemoStore = {
  roles: RoleRecord[];
  users: UserRecord[];
  streets: StreetRecord[];
  houses: HouseRecord[];
  residents: ResidentRecord[];
  cycles: MonthlyFeeCycleRecord[];
  dues: FeeDueRecord[];
  payments: PaymentRecord[];
  receipts: ReceiptRecord[];
  adjustments: BalanceAdjustmentRecord[];
  auditLogs: AuditLogRecord[];
  settings: SocietySettingsRecord;
};
