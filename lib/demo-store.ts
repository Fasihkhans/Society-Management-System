import bcrypt from "bcryptjs";

import type {
  DemoStore,
  FeeDueRecord,
  PaymentMethod,
  PaymentRecord,
  ReceiptRecord,
  ResidentRecord,
  RoleRecord,
  StreetRecord,
  UserRecord
} from "@/lib/types";

type SeedHouse = {
  id: string;
  streetId: string;
  houseNumber: string;
  ownerName: string;
  cnic: string;
  mobile: string;
  ownerEmail: string | null;
  monthlyFeeAmount: number;
  openingBalance: number;
  notes: string;
};

declare global {
  var workSocietyDemoStore: DemoStore | undefined;
}

function isoDate(value: string) {
  return new Date(value).toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

const roles: RoleRecord[] = [
  { id: "role-admin", name: "ADMIN", description: "Full system access" },
  { id: "role-street-rep", name: "STREET_REP", description: "Assigned street access only" }
];

const streets: StreetRecord[] = [
  {
    id: "street-1",
    number: "1",
    name: "Main Gate Street",
    notes: "High recovery area near community gate.",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "street-2",
    number: "2",
    name: "Park View Street",
    notes: "Mixed owners and tenants.",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "street-3",
    number: "3",
    name: "Service Lane",
    notes: "Requires more recovery follow-up.",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "street-7a",
    number: "7A",
    name: "Masjid Link Road",
    notes: "Small street with full recovery.",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "street-10a",
    number: "10A",
    name: "Corner Extension",
    notes: "Older pending balances are common here.",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  }
];

const users: UserRecord[] = [
  {
    id: "user-admin-1",
    name: "Society Admin",
    email: "admin@worksociety.test",
    passwordHash: bcrypt.hashSync("Admin123!", 10),
    role: "ADMIN",
    assignedStreetId: null,
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "user-rep-1",
    name: "Muhammad Junaid",
    email: "street1@worksociety.test",
    passwordHash: bcrypt.hashSync("Street123!", 10),
    role: "STREET_REP",
    assignedStreetId: "street-1",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  },
  {
    id: "user-rep-2",
    name: "Sajid Mehmood",
    email: "street2@worksociety.test",
    passwordHash: bcrypt.hashSync("Street123!", 10),
    role: "STREET_REP",
    assignedStreetId: "street-2",
    isActive: true,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  }
];

const seedHouses: SeedHouse[] = [
  {
    id: "house-1",
    streetId: "street-1",
    houseNumber: "A-31",
    ownerName: "Rashid Iqbal",
    cnic: "35202-1234567-1",
    mobile: "0312-555-0101",
    ownerEmail: "rashid@example.com",
    monthlyFeeAmount: 1000,
    openingBalance: 1000,
    notes: "Owner occupied. Uses viewer verification demo."
  },
  {
    id: "house-2",
    streetId: "street-1",
    houseNumber: "A-32",
    ownerName: "Nasreen Bibi",
    cnic: "35202-9876543-8",
    mobile: "0301-555-0102",
    ownerEmail: null,
    monthlyFeeAmount: 1000,
    openingBalance: 2000,
    notes: "Partial payer."
  },
  {
    id: "house-3",
    streetId: "street-2",
    houseNumber: "A-49",
    ownerName: "Faisal Javed",
    cnic: "35202-3334445-6",
    mobile: "0302-555-0201",
    ownerEmail: "faisal@example.com",
    monthlyFeeAmount: 1000,
    openingBalance: 0,
    notes: "One tenant record exists."
  },
  {
    id: "house-4",
    streetId: "street-2",
    houseNumber: "A-50",
    ownerName: "Uzma Irfan",
    cnic: "35202-7654321-7",
    mobile: "0345-555-0202",
    ownerEmail: "uzma@example.com",
    monthlyFeeAmount: 1000,
    openingBalance: 0,
    notes: ""
  },
  {
    id: "house-5",
    streetId: "street-3",
    houseNumber: "B-11",
    ownerName: "Khalid Bukhari",
    cnic: "35202-2223334-5",
    mobile: "0300-555-0901",
    ownerEmail: null,
    monthlyFeeAmount: 1500,
    openingBalance: 3000,
    notes: "Older pending dues."
  },
  {
    id: "house-6",
    streetId: "street-7a",
    houseNumber: "C-02",
    ownerName: "Arif Hussain",
    cnic: "35202-4443332-1",
    mobile: "0331-555-0701",
    ownerEmail: null,
    monthlyFeeAmount: 1200,
    openingBalance: 0,
    notes: "Street fully recovered."
  },
  {
    id: "house-7",
    streetId: "street-10a",
    houseNumber: "C-07",
    ownerName: "Hina Ashraf",
    cnic: "35202-8887776-4",
    mobile: "0333-555-1010",
    ownerEmail: "hina@example.com",
    monthlyFeeAmount: 1000,
    openingBalance: 2000,
    notes: "Pending follow-up required."
  }
];

function buildStore(): DemoStore {
  const houses = seedHouses.map((house) => ({
    ...house,
    status: "ACTIVE" as const,
    createdAt: isoDate("2026-01-01"),
    updatedAt: isoDate("2026-01-01"),
    deletedAt: null
  }));

  const residents: ResidentRecord[] = [
    ...houses.map((house) => ({
      id: `resident-owner-${house.id}`,
      houseId: house.id,
      fullName: house.ownerName,
      residentType: "OWNER" as const,
      cnic: house.cnic,
      mobile: house.mobile,
      email: house.ownerEmail,
      isPrimary: true,
      verificationEnabled: true,
      createdAt: isoDate("2026-01-01"),
      updatedAt: isoDate("2026-01-01"),
      deletedAt: null
    })),
    {
      id: "resident-tenant-house-3",
      houseId: "house-3",
      fullName: "Ali Raza",
      residentType: "TENANT",
      cnic: "35201-1112223-9",
      mobile: "0306-555-0203",
      email: null,
      isPrimary: false,
      verificationEnabled: false,
      createdAt: isoDate("2026-02-01"),
      updatedAt: isoDate("2026-02-01"),
      deletedAt: null
    }
  ];

  const cycles = [
    { id: "cycle-2026-1", month: 1, year: 2026, title: "January 2026" },
    { id: "cycle-2026-2", month: 2, year: 2026, title: "February 2026" },
    { id: "cycle-2026-3", month: 3, year: 2026, title: "March 2026" },
    { id: "cycle-2026-4", month: 4, year: 2026, title: "April 2026" }
  ].map((cycle) => ({
    ...cycle,
    notes: "",
    createdById: "user-admin-1",
    generatedAt: isoDate(`${cycle.year}-${String(cycle.month).padStart(2, "0")}-01`)
  }));

  const paymentPlan: Record<string, Record<string, Array<{ amount: number; date: string; method: PaymentMethod }>>> =
    {
      "house-1": {
        "cycle-2026-1": [{ amount: 2000, date: "2026-01-07", method: "CASH" }],
        "cycle-2026-2": [{ amount: 1000, date: "2026-02-06", method: "CASH" }],
        "cycle-2026-3": [{ amount: 1000, date: "2026-03-05", method: "BANK_TRANSFER" }],
        "cycle-2026-4": [{ amount: 1000, date: "2026-04-04", method: "EASYPAISA" }]
      },
      "house-2": {
        "cycle-2026-1": [{ amount: 1500, date: "2026-01-11", method: "CASH" }],
        "cycle-2026-2": [{ amount: 500, date: "2026-02-15", method: "CASH" }],
        "cycle-2026-3": [{ amount: 1000, date: "2026-03-10", method: "JAZZCASH" }]
      },
      "house-3": {
        "cycle-2026-1": [{ amount: 1000, date: "2026-01-09", method: "CASH" }],
        "cycle-2026-2": [{ amount: 1000, date: "2026-02-13", method: "BANK_TRANSFER" }],
        "cycle-2026-3": [{ amount: 1000, date: "2026-03-14", method: "BANK_TRANSFER" }],
        "cycle-2026-4": [{ amount: 1000, date: "2026-04-12", method: "CASH" }]
      },
      "house-4": {
        "cycle-2026-1": [{ amount: 1000, date: "2026-01-12", method: "CASH" }],
        "cycle-2026-2": [{ amount: 1000, date: "2026-02-10", method: "CASH" }],
        "cycle-2026-3": [{ amount: 1000, date: "2026-03-08", method: "CASH" }],
        "cycle-2026-4": [{ amount: 1000, date: "2026-04-09", method: "CASH" }]
      },
      "house-5": {
        "cycle-2026-1": [{ amount: 2000, date: "2026-01-20", method: "BANK_TRANSFER" }],
        "cycle-2026-2": [{ amount: 1500, date: "2026-02-18", method: "CASH" }]
      },
      "house-6": {
        "cycle-2026-1": [{ amount: 1200, date: "2026-01-04", method: "CASH" }],
        "cycle-2026-2": [{ amount: 1200, date: "2026-02-04", method: "CASH" }],
        "cycle-2026-3": [{ amount: 1200, date: "2026-03-04", method: "CASH" }],
        "cycle-2026-4": [{ amount: 1200, date: "2026-04-04", method: "CASH" }]
      },
      "house-7": {
        "cycle-2026-1": [{ amount: 1000, date: "2026-01-28", method: "JAZZCASH" }],
        "cycle-2026-3": [{ amount: 1000, date: "2026-03-27", method: "EASYPAISA" }]
      }
    };

  const dues: FeeDueRecord[] = [];
  const payments: PaymentRecord[] = [];
  const receipts: ReceiptRecord[] = [];

  for (const house of houses) {
    let carryForward = house.openingBalance;

    for (const cycle of cycles) {
      const plannedPayments = paymentPlan[house.id]?.[cycle.id] ?? [];
      const amountReceived = plannedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalDue = house.monthlyFeeAmount + carryForward;
      const balanceRemaining = Math.max(totalDue - amountReceived, 0);
      const dueId = `due-${house.id}-${cycle.month}`;
      const status =
        balanceRemaining === 0 ? "PAID" : amountReceived > 0 ? "PARTIAL" : "PENDING";

      dues.push({
        id: dueId,
        cycleId: cycle.id,
        houseId: house.id,
        amountDue: house.monthlyFeeAmount,
        openingBalance: carryForward,
        totalDue,
        amountReceived,
        balanceRemaining,
        status,
        dueDate: isoDate(`${cycle.year}-${String(cycle.month).padStart(2, "0")}-10`),
        createdAt: cycle.generatedAt,
        updatedAt: isoDate(`${cycle.year}-${String(cycle.month).padStart(2, "0")}-28`),
        deletedAt: null
      });

      for (const payment of plannedPayments) {
        const paymentId = uid("payment");
        const createdAt = isoDate(payment.date);
        payments.push({
          id: paymentId,
          feeDueId: dueId,
          amount: payment.amount,
          paymentDate: createdAt,
          paymentMethod: payment.method,
          collectedById:
            house.streetId === "street-1"
              ? "user-rep-1"
              : house.streetId === "street-2"
                ? "user-rep-2"
                : "user-admin-1",
          notes: "",
          createdAt,
          deletedAt: null
        });

        const paidSoFar = payments
          .filter((item) => item.feeDueId === dueId)
          .reduce((sum, item) => sum + item.amount, 0);

        receipts.push({
          id: uid("receipt"),
          paymentId,
          receiptNumber: `WS-${cycle.year}${String(cycle.month).padStart(2, "0")}-${String(
            receipts.length + 1
          ).padStart(4, "0")}`,
          balanceAfterPayment: Math.max(totalDue - paidSoFar, 0),
          createdAt
        });
      }

      carryForward = balanceRemaining;
    }
  }

  return {
    roles,
    users,
    streets,
    houses,
    residents,
    cycles,
    dues,
    payments,
    receipts,
    adjustments: [
      {
        id: "adjustment-1",
        houseId: "house-5",
        feeDueId: "due-house-5-1",
        amount: -500,
        reason: "Old ledger correction approved by admin.",
        adjustedById: "user-admin-1",
        createdAt: isoDate("2026-01-03")
      }
    ],
    auditLogs: [
      {
        id: "audit-1",
        userId: "user-admin-1",
        entityType: "PAYMENT",
        entityId: "seed-data",
        action: "SEED",
        details: "Initial demo payments imported from sample records.",
        createdAt: isoDate("2026-01-01")
      }
    ],
    settings: {
      societyName: "Work Society Management System",
      receiptPrefix: "WS",
      defaultDueDay: 10,
      supportPhone: "0300-000-0000",
      viewerNotice:
        "Please verify using your exact house number, CNIC, and registered mobile number."
    }
  };
}

export const demoStore = global.workSocietyDemoStore ?? buildStore();

if (!global.workSocietyDemoStore) {
  global.workSocietyDemoStore = demoStore;
}
