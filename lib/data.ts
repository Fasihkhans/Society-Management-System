export type StreetMetric = {
  street: string;
  expected: number;
  received: number;
  pending: number;
  houses: number;
  representative: string;
  collector: string;
};

export type MonthlyFigure = {
  month: string;
  value: number;
};

export type ExpenseCategory = {
  category: string;
  budget: number;
  spent: number;
  note: string;
};

export type ResidentRecord = {
  id: string;
  name: string;
  houseNumber: string;
  street: string;
  cnic: string;
  mobile: string;
  monthlyDue: number;
  outstanding: number;
  status: "Paid" | "Partially due" | "Overdue";
  representative: string;
};

export type ReceiptRecord = {
  receiptNo: string;
  houseNumber: string;
  street: string;
  year: number;
  month: string;
  amount: number;
  date: string;
  collector: string;
};

export type MigrationBatch = {
  title: string;
  source: string;
  records: string;
  status: "Ready" | "Review needed" | "In progress";
};

export const streetMetrics: StreetMetric[] = [
  { street: "1", expected: 156000, received: 99500, pending: 56500, houses: 28, representative: "Muhammad Junaid", collector: "Muhammad Junaid" },
  { street: "2", expected: 102000, received: 82500, pending: 19500, houses: 22, representative: "Sajid Mehmood", collector: "Sajid Mehmood" },
  { street: "3", expected: 60000, received: 26000, pending: 34000, houses: 14, representative: "Usman Tariq", collector: "Usman Tariq" },
  { street: "4", expected: 78000, received: 54000, pending: 24000, houses: 18, representative: "Farhan Ali", collector: "Farhan Ali" },
  { street: "5", expected: 7000, received: 7000, pending: 0, houses: 3, representative: "Nadeem Akhtar", collector: "Nadeem Akhtar" },
  { street: "6", expected: 138000, received: 112000, pending: 26000, houses: 26, representative: "Imran Babar", collector: "Imran Babar" },
  { street: "7", expected: 120000, received: 82500, pending: 37500, houses: 24, representative: "Khurram Shah", collector: "Khurram Shah" },
  { street: "8", expected: 138000, received: 106500, pending: 31500, houses: 25, representative: "Bilal Ahmed", collector: "Bilal Ahmed" },
  { street: "9", expected: 180000, received: 107000, pending: 73000, houses: 31, representative: "Adeel Raza", collector: "Adeel Raza" },
  { street: "10", expected: 102000, received: 67000, pending: 35000, houses: 20, representative: "Shahid Iqbal", collector: "Shahid Iqbal" },
  { street: "11", expected: 78000, received: 64000, pending: 14000, houses: 18, representative: "Kashif Khan", collector: "Kashif Khan" },
  { street: "12", expected: 78000, received: 73000, pending: 5000, houses: 18, representative: "Tariq Saeed", collector: "Tariq Saeed" },
  { street: "10A", expected: 84000, received: 46000, pending: 38000, houses: 16, representative: "Mubashir Qureshi", collector: "Mubashir Qureshi" },
  { street: "7A", expected: 48000, received: 48000, pending: 0, houses: 11, representative: "Arif Hussain", collector: "Arif Hussain" }
];

export const monthlyCollection: MonthlyFigure[] = [
  { month: "Jul 2025", value: 220000 },
  { month: "Aug 2025", value: 207500 },
  { month: "Sep 2025", value: 194000 },
  { month: "Oct 2025", value: 193500 },
  { month: "Nov 2025", value: 134500 },
  { month: "Dec 2025", value: 114000 }
];

export const monthlyExpenses: MonthlyFigure[] = [
  { month: "Jul 2025", value: 92000 },
  { month: "Aug 2025", value: 96000 },
  { month: "Sep 2025", value: 90500 },
  { month: "Oct 2025", value: 94000 },
  { month: "Nov 2025", value: 81500 },
  { month: "Dec 2025", value: 77000 }
];

export const expenseCategories: ExpenseCategory[] = [
  { category: "Security guards", budget: 270000, spent: 258000, note: "Main gate and night shift coverage" },
  { category: "Street lights and repairs", budget: 92000, spent: 84600, note: "Bulbs, wiring, and emergency electrician visits" },
  { category: "Drainage and cleaning", budget: 76000, spent: 70100, note: "Street cleaning, drain opening, and waste pickup" },
  { category: "Office and receipt books", budget: 36000, spent: 29200, note: "Receipt pads, toner, registers, and stationery" },
  { category: "Water and common maintenance", budget: 84000, spent: 88700, note: "Minor overrun due to pump service and tanker support" }
];

export const residents: ResidentRecord[] = [
  {
    id: "R-001",
    name: "Rashid Iqbal",
    houseNumber: "A-31",
    street: "1",
    cnic: "35202-1234567-1",
    mobile: "0312-555-0101",
    monthlyDue: 1000,
    outstanding: 0,
    status: "Paid",
    representative: "Muhammad Junaid"
  },
  {
    id: "R-002",
    name: "Nasreen Bibi",
    houseNumber: "A-32",
    street: "1",
    cnic: "35202-9876543-8",
    mobile: "0301-555-0102",
    monthlyDue: 1000,
    outstanding: 2000,
    status: "Partially due",
    representative: "Muhammad Junaid"
  },
  {
    id: "R-003",
    name: "Sohail Ahmed",
    houseNumber: "A-34",
    street: "1",
    cnic: "35201-4567890-1",
    mobile: "0321-555-0103",
    monthlyDue: 1000,
    outstanding: 4000,
    status: "Overdue",
    representative: "Muhammad Junaid"
  },
  {
    id: "R-004",
    name: "Shabana Tariq",
    houseNumber: "A-38",
    street: "1",
    cnic: "35202-2001002-9",
    mobile: "0307-555-0104",
    monthlyDue: 1000,
    outstanding: 0,
    status: "Paid",
    representative: "Muhammad Junaid"
  },
  {
    id: "R-005",
    name: "Faisal Javed",
    houseNumber: "A-49",
    street: "2",
    cnic: "35202-3334445-6",
    mobile: "0302-555-0201",
    monthlyDue: 1000,
    outstanding: 1000,
    status: "Partially due",
    representative: "Sajid Mehmood"
  },
  {
    id: "R-006",
    name: "Uzma Irfan",
    houseNumber: "A-50",
    street: "2",
    cnic: "35202-7654321-7",
    mobile: "0345-555-0202",
    monthlyDue: 1000,
    outstanding: 0,
    status: "Paid",
    representative: "Sajid Mehmood"
  },
  {
    id: "R-007",
    name: "Khalid Bukhari",
    houseNumber: "B-11",
    street: "9",
    cnic: "35202-2223334-5",
    mobile: "0300-555-0901",
    monthlyDue: 1500,
    outstanding: 4500,
    status: "Overdue",
    representative: "Adeel Raza"
  },
  {
    id: "R-008",
    name: "Hina Ashraf",
    houseNumber: "C-07",
    street: "10A",
    cnic: "35202-8887776-4",
    mobile: "0333-555-1010",
    monthlyDue: 1000,
    outstanding: 3000,
    status: "Overdue",
    representative: "Mubashir Qureshi"
  }
];

export const receipts: ReceiptRecord[] = [
  { receiptNo: "RC-251201", houseNumber: "A-31", street: "1", year: 2025, month: "Dec", amount: 1000, date: "2025-12-06", collector: "Muhammad Junaid" },
  { receiptNo: "RC-251110", houseNumber: "A-31", street: "1", year: 2025, month: "Nov", amount: 1000, date: "2025-11-05", collector: "Muhammad Junaid" },
  { receiptNo: "RC-251015", houseNumber: "A-31", street: "1", year: 2025, month: "Oct", amount: 1000, date: "2025-10-07", collector: "Muhammad Junaid" },
  { receiptNo: "RC-251002", houseNumber: "A-32", street: "1", year: 2025, month: "Oct", amount: 1000, date: "2025-10-03", collector: "Muhammad Junaid" },
  { receiptNo: "RC-250924", houseNumber: "A-38", street: "1", year: 2025, month: "Sep", amount: 1000, date: "2025-09-28", collector: "Muhammad Junaid" },
  { receiptNo: "RC-250818", houseNumber: "A-50", street: "2", year: 2025, month: "Aug", amount: 1000, date: "2025-08-14", collector: "Sajid Mehmood" },
  { receiptNo: "RC-250730", houseNumber: "A-49", street: "2", year: 2025, month: "Jul", amount: 1000, date: "2025-07-30", collector: "Sajid Mehmood" },
  { receiptNo: "RC-250706", houseNumber: "B-11", street: "9", year: 2025, month: "Jul", amount: 1500, date: "2025-07-19", collector: "Adeel Raza" },
  { receiptNo: "RC-251009", houseNumber: "C-07", street: "10A", year: 2025, month: "Oct", amount: 1000, date: "2025-10-09", collector: "Mubashir Qureshi" }
];

export const migrationBatches: MigrationBatch[] = [
  {
    title: "Street-wise recovery sheet",
    source: "Printed summary by street",
    records: "14 streets, expected vs received vs recovery percentage",
    status: "Ready"
  },
  {
    title: "Street-wise pending dues",
    source: "Printed pending dues list",
    records: "Grand totals for dues, received amount, and balances",
    status: "Ready"
  },
  {
    title: "Monthly subscription money",
    source: "Jul-Dec 2025 register",
    records: "6 monthly totals plus per-street monthly collections",
    status: "Ready"
  },
  {
    title: "House-wise ledger pages",
    source: "Paper ledger with balances and handwritten updates",
    records: "House number, street number, monthly amounts, running balance",
    status: "Review needed"
  },
  {
    title: "Income and expense closing",
    source: "Closing summary sheets",
    records: "Monthly opening cash, expenses, and closing balance",
    status: "In progress"
  }
];

export const rolePermissions = [
  {
    role: "Admin",
    access: "All streets and all reports",
    canDo: "Add receipts, update records, delete incorrect entries, assign representatives, and approve imported paper data."
  },
  {
    role: "Street representative / collector",
    access: "Only their own street",
    canDo: "View households in that street, collect monthly maintenance, issue receipts, and track pending dues."
  },
  {
    role: "Resident viewer",
    access: "Only their own receipts after verification",
    canDo: "Verify with house number, CNIC, and mobile number. View receipt no, house no, street, month, amount, and date."
  }
];

export const adminQuickActions = [
  "Add a new receipt for any house.",
  "Correct an old record without changing other streets.",
  "Review imported paper batches before final posting.",
  "Monitor which streets are below recovery target."
];

export const collectorChecklist = [
  "See only your street households and balances.",
  "Collect cash and post the receipt immediately.",
  "Mark follow-up visits for overdue houses.",
  "Send summary back to admin at month end."
];

export const paperToDigitalFlow = [
  "Street totals become performance dashboards.",
  "House ledgers become resident profiles and receipt history.",
  "Monthly sheets become collection trends and cash summaries.",
  "Expense notes become searchable finance records."
];

export const focusStreet = "1";

export const totals = streetMetrics.reduce(
  (acc, street) => {
    acc.expected += street.expected;
    acc.received += street.received;
    acc.pending += street.pending;
    acc.houses += street.houses;
    return acc;
  },
  { expected: 0, received: 0, pending: 0, houses: 0 }
);

export const totalRecoveryRate = (totals.received / totals.expected) * 100;

export const expenseTotal = monthlyExpenses.reduce((sum, item) => sum + item.value, 0);

export const netBalance = totals.received - expenseTotal;
