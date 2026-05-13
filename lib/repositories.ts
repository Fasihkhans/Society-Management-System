import bcrypt from "bcryptjs";

import { demoStore } from "@/lib/demo-store";
import { formatMonthYear, normalizeString } from "@/lib/utils";
import type { AdjustmentInput } from "@/lib/validations/adjustment";
import type { FeeCycleInput } from "@/lib/validations/fee-cycle";
import type { HouseInput } from "@/lib/validations/house";
import type { PaymentInput } from "@/lib/validations/payment";
import type { ResidentInput } from "@/lib/validations/resident";
import type { SettingsInput } from "@/lib/validations/settings";
import type { StreetInput } from "@/lib/validations/street";
import type { UserInput } from "@/lib/validations/user";
import type {
  DueStatus,
  FeeDueRecord,
  HouseRecord,
  SessionUser,
  StreetRecord,
  UserRecord
} from "@/lib/types";

const demoMode = process.env.DEMO_MODE !== "false";

function ensureDemoMode() {
  if (!demoMode) {
    throw new Error("Live database mode is not configured in this local environment yet.");
  }
}

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function activeStreets() {
  return demoStore.streets.filter((street) => !street.deletedAt);
}

function activeHouses() {
  return demoStore.houses.filter((house) => !house.deletedAt);
}

function activeResidents() {
  return demoStore.residents.filter((resident) => !resident.deletedAt);
}

function activeUsers() {
  return demoStore.users.filter((user) => !user.deletedAt && user.isActive);
}

function activeDues() {
  return demoStore.dues.filter((due) => !due.deletedAt);
}

function accessibleStreetIds(session: SessionUser) {
  return session.role === "ADMIN"
    ? activeStreets().map((street) => street.id)
    : session.assignedStreetId
      ? [session.assignedStreetId]
      : [];
}

function getStreetById(streetId: string) {
  const street = demoStore.streets.find((item) => item.id === streetId && !item.deletedAt);
  if (!street) {
    throw new Error("Street not found.");
  }
  return street;
}

function getHouseByIdInternal(houseId: string) {
  const house = demoStore.houses.find((item) => item.id === houseId && !item.deletedAt);
  if (!house) {
    throw new Error("House not found.");
  }
  return house;
}

function getDueById(dueId: string) {
  const due = demoStore.dues.find((item) => item.id === dueId && !item.deletedAt);
  if (!due) {
    throw new Error("Fee due record not found.");
  }
  return due;
}

function getCycleById(cycleId: string) {
  const cycle = demoStore.cycles.find((item) => item.id === cycleId);
  if (!cycle) {
    throw new Error("Fee cycle not found.");
  }
  return cycle;
}

function sortCycles() {
  return [...demoStore.cycles].sort((a, b) => (a.year - b.year) || (a.month - b.month));
}

function getRepresentativeName(streetId: string) {
  return activeUsers().find((user) => user.assignedStreetId === streetId)?.name ?? "Not assigned";
}

function getLatestDueForHouse(houseId: string) {
  return [...activeDues()]
    .filter((due) => due.houseId === houseId)
    .sort((a, b) => {
      const cycleA = getCycleById(a.cycleId);
      const cycleB = getCycleById(b.cycleId);
      return cycleB.year - cycleA.year || cycleB.month - cycleA.month;
    })[0];
}

function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    assignedStreetId: user.assignedStreetId
  };
}

function requireAdmin(session: SessionUser) {
  if (session.role !== "ADMIN") {
    throw new Error("Only the admin can perform this action.");
  }
}

function ensureStreetAccess(session: SessionUser, streetId: string) {
  if (session.role === "ADMIN") {
    return;
  }
  if (session.assignedStreetId !== streetId) {
    throw new Error("You can only access your assigned street.");
  }
}

function computeDueStatus(totalDue: number, amountReceived: number): DueStatus {
  const remaining = Math.max(totalDue - amountReceived, 0);
  if (remaining === 0) {
    return "PAID";
  }
  if (amountReceived > 0) {
    return "PARTIAL";
  }
  return "PENDING";
}

function createReceiptNumber(cycleId: string) {
  const cycle = getCycleById(cycleId);
  const prefix = demoStore.settings.receiptPrefix;
  const sequence = String(demoStore.receipts.length + 1).padStart(4, "0");
  return `${prefix}-${cycle.year}${String(cycle.month).padStart(2, "0")}-${sequence}`;
}

function addAuditLog(userId: string, entityType: string, entityId: string, action: string, details: string) {
  demoStore.auditLogs.push({
    id: uid("audit"),
    userId,
    entityType,
    entityId,
    action,
    details,
    createdAt: nowIso()
  });
}

function primaryResidentForHouse(houseId: string) {
  return activeResidents().find((resident) => resident.houseId === houseId && resident.isPrimary);
}

export function isDemoMode() {
  return demoMode;
}

export async function authenticateUser(email: string, password: string) {
  ensureDemoMode();
  const user = activeUsers().find((item) => item.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return toSessionUser(user);
}

export async function getDashboardData(session: SessionUser) {
  ensureDemoMode();

  const streetIds = accessibleStreetIds(session);
  const streets = activeStreets().filter((street) => streetIds.includes(street.id));
  const houses = activeHouses().filter((house) => streetIds.includes(house.streetId));
  const dues = activeDues().filter((due) => houses.some((house) => house.id === due.houseId));
  const currentCycle = sortCycles().at(-1);
  const currentCycleDues = currentCycle ? dues.filter((due) => due.cycleId === currentCycle.id) : [];

  const streetRecovery = streets.map((street) => {
    const streetHouses = houses.filter((house) => house.streetId === street.id);
    const streetDues = dues.filter((due) => streetHouses.some((house) => house.id === due.houseId));
    const expected = streetDues.reduce((sum, due) => sum + due.totalDue, 0);
    const received = streetDues.reduce((sum, due) => sum + due.amountReceived, 0);
    const pending = streetDues.reduce((sum, due) => sum + due.balanceRemaining, 0);

    return {
      streetId: street.id,
      streetNumber: street.number,
      representative: getRepresentativeName(street.id),
      expected,
      received,
      pending,
      recovery: expected > 0 ? Math.round((received / expected) * 100) : 0
    };
  });

  return {
    houseCount: houses.length,
    streetCount: streets.length,
    totalCollected: dues.reduce((sum, due) => sum + due.amountReceived, 0),
    totalPending: dues.reduce((sum, due) => sum + due.balanceRemaining, 0),
    currentMonthCollection: currentCycleDues.reduce((sum, due) => sum + due.amountReceived, 0),
    currentMonthPending: currentCycleDues.reduce((sum, due) => sum + due.balanceRemaining, 0),
    currentCycle,
    streetRecovery,
    quickActions:
      session.role === "ADMIN"
        ? [
            { href: "/fee-cycles", label: "Generate monthly dues" },
            { href: "/collections", label: "Record a payment" },
            { href: "/pending-dues", label: "Review pending dues" }
          ]
        : [
            { href: "/collections", label: "Collect monthly fee" },
            { href: "/pending-dues", label: "Check street pending" },
            { href: "/houses", label: "See assigned houses" }
          ]
  };
}

export async function listStreets(session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  return activeStreets().map((street) => {
    const houses = activeHouses().filter((house) => house.streetId === street.id);
    const dues = activeDues().filter((due) => houses.some((house) => house.id === due.houseId));
    const expected = dues.reduce((sum, due) => sum + due.totalDue, 0);
    const received = dues.reduce((sum, due) => sum + due.amountReceived, 0);
    const pending = dues.reduce((sum, due) => sum + due.balanceRemaining, 0);

    return {
      ...street,
      representativeName: getRepresentativeName(street.id),
      houseCount: houses.length,
      expected,
      received,
      pending,
      recovery: expected > 0 ? Math.round((received / expected) * 100) : 0
    };
  });
}

export async function createStreet(input: StreetInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  if (activeStreets().some((street) => street.number === input.number)) {
    throw new Error("Street number already exists.");
  }

  const createdAt = nowIso();
  const street: StreetRecord = {
    id: uid("street"),
    number: input.number,
    name: input.name,
    notes: input.notes ?? "",
    isActive: true,
    createdAt,
    updatedAt: createdAt,
    deletedAt: null
  };

  demoStore.streets.push(street);
  addAuditLog(session.id, "STREET", street.id, "CREATE", `Street ${street.number} created.`);
  return street;
}

export async function updateStreet(streetId: string, input: StreetInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);
  const street = getStreetById(streetId);

  if (
    activeStreets().some((item) => item.id !== streetId && item.number.toLowerCase() === input.number.toLowerCase())
  ) {
    throw new Error("Street number already exists.");
  }

  street.number = input.number;
  street.name = input.name;
  street.notes = input.notes ?? "";
  street.updatedAt = nowIso();
  addAuditLog(session.id, "STREET", street.id, "UPDATE", `Street ${street.number} updated.`);
  return street;
}

export async function deleteStreet(streetId: string, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);
  const street = getStreetById(streetId);

  if (activeHouses().some((house) => house.streetId === streetId)) {
    throw new Error("You cannot delete a street that still has linked houses.");
  }

  street.deletedAt = nowIso();
  street.isActive = false;
  street.updatedAt = nowIso();
  addAuditLog(session.id, "STREET", street.id, "DELETE", `Street ${street.number} soft deleted.`);
}

export async function listHouses(
  session: SessionUser,
  filters: { search?: string; streetId?: string; status?: string }
) {
  ensureDemoMode();
  const allowedStreetIds = accessibleStreetIds(session);
  const search = normalizeString(filters.search ?? "");

  return activeHouses()
    .filter((house) => allowedStreetIds.includes(house.streetId))
    .filter((house) => (filters.streetId ? house.streetId === filters.streetId : true))
    .filter((house) => (filters.status ? house.status === filters.status : true))
    .filter((house) => {
      if (!search) {
        return true;
      }

      return [house.houseNumber, house.ownerName, house.mobile, house.cnic]
        .join(" ")
        .toLowerCase()
        .includes(search);
    })
    .map((house) => {
      const street = getStreetById(house.streetId);
      const latestDue = getLatestDueForHouse(house.id);
      return {
        ...house,
        streetNumber: street.number,
        streetName: street.name,
        representativeName: getRepresentativeName(street.id),
        currentBalance: latestDue?.balanceRemaining ?? house.openingBalance
      };
    });
}

export async function getHouseDetail(houseId: string, session: SessionUser) {
  ensureDemoMode();
  const house = getHouseByIdInternal(houseId);
  ensureStreetAccess(session, house.streetId);

  const street = getStreetById(house.streetId);
  const residents = activeResidents().filter((resident) => resident.houseId === house.id);

  return {
    ...house,
    street,
    residents
  };
}

export async function createHouse(input: HouseInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  if (
    activeHouses().some(
      (house) =>
        house.streetId === input.streetId &&
        normalizeString(house.houseNumber) === normalizeString(input.houseNumber)
    )
  ) {
    throw new Error("A house with this number already exists in the selected street.");
  }

  const createdAt = nowIso();
  const house: HouseRecord = {
    id: uid("house"),
    streetId: input.streetId,
    houseNumber: input.houseNumber,
    ownerName: input.ownerName,
    cnic: input.cnic,
    mobile: input.mobile,
    ownerEmail: input.ownerEmail || null,
    status: input.status,
    monthlyFeeAmount: input.monthlyFeeAmount,
    openingBalance: input.openingBalance,
    notes: input.notes ?? "",
    createdAt,
    updatedAt: createdAt,
    deletedAt: null
  };

  demoStore.houses.push(house);
  demoStore.residents.push({
    id: uid("resident"),
    houseId: house.id,
    fullName: input.ownerName,
    residentType: "OWNER",
    cnic: input.cnic,
    mobile: input.mobile,
    email: input.ownerEmail || null,
    isPrimary: true,
    verificationEnabled: true,
    createdAt,
    updatedAt: createdAt,
    deletedAt: null
  });

  addAuditLog(session.id, "HOUSE", house.id, "CREATE", `House ${house.houseNumber} created.`);
  return house;
}

export async function updateHouse(houseId: string, input: HouseInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  const house = getHouseByIdInternal(houseId);
  if (
    activeHouses().some(
      (item) =>
        item.id !== houseId &&
        item.streetId === input.streetId &&
        normalizeString(item.houseNumber) === normalizeString(input.houseNumber)
    )
  ) {
    throw new Error("A house with this number already exists in the selected street.");
  }

  house.streetId = input.streetId;
  house.houseNumber = input.houseNumber;
  house.ownerName = input.ownerName;
  house.cnic = input.cnic;
  house.mobile = input.mobile;
  house.ownerEmail = input.ownerEmail || null;
  house.status = input.status;
  house.monthlyFeeAmount = input.monthlyFeeAmount;
  house.openingBalance = input.openingBalance;
  house.notes = input.notes ?? "";
  house.updatedAt = nowIso();

  const ownerResident = primaryResidentForHouse(house.id);
  if (ownerResident) {
    ownerResident.fullName = input.ownerName;
    ownerResident.cnic = input.cnic;
    ownerResident.mobile = input.mobile;
    ownerResident.email = input.ownerEmail || null;
    ownerResident.updatedAt = nowIso();
  }

  addAuditLog(session.id, "HOUSE", house.id, "UPDATE", `House ${house.houseNumber} updated.`);
  return house;
}

export async function listResidents(
  session: SessionUser,
  filters: { search?: string; streetId?: string }
) {
  ensureDemoMode();
  const allowedStreetIds = accessibleStreetIds(session);
  const search = normalizeString(filters.search ?? "");

  return activeResidents()
    .map((resident) => {
      const house = getHouseByIdInternal(resident.houseId);
      const street = getStreetById(house.streetId);
      return { ...resident, house, street };
    })
    .filter((resident) => allowedStreetIds.includes(resident.house.streetId))
    .filter((resident) => (filters.streetId ? resident.street.id === filters.streetId : true))
    .filter((resident) => {
      if (!search) {
        return true;
      }
      return [resident.fullName, resident.mobile, resident.cnic, resident.house.houseNumber]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
}

export async function createResident(input: ResidentInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  const house = getHouseByIdInternal(input.houseId);
  const createdAt = nowIso();
  const resident = {
    id: uid("resident"),
    houseId: house.id,
    fullName: input.fullName,
    residentType: input.residentType,
    cnic: input.cnic,
    mobile: input.mobile,
    email: input.email || null,
    isPrimary: input.isPrimary,
    verificationEnabled: input.residentType === "OWNER",
    createdAt,
    updatedAt: createdAt,
    deletedAt: null
  };

  if (input.isPrimary) {
    activeResidents()
      .filter((item) => item.houseId === house.id)
      .forEach((item) => {
        item.isPrimary = false;
        item.updatedAt = createdAt;
      });
  }

  demoStore.residents.push(resident);
  addAuditLog(session.id, "RESIDENT", resident.id, "CREATE", `Resident ${resident.fullName} added.`);
  return resident;
}

export async function listUsers(session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);
  return activeUsers().map((user) => ({
    ...user,
    assignedStreetNumber: user.assignedStreetId
      ? getStreetById(user.assignedStreetId).number
      : "All streets"
  }));
}

export async function createUser(input: UserInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  if (activeUsers().some((user) => normalizeString(user.email) === normalizeString(input.email))) {
    throw new Error("A user with this email already exists.");
  }

  if (input.role === "STREET_REP") {
    if (!input.assignedStreetId) {
      throw new Error("Please assign a street representative to a street.");
    }

    if (
      activeUsers().some(
        (user) => user.role === "STREET_REP" && user.assignedStreetId === input.assignedStreetId
      )
    ) {
      throw new Error("This street already has an assigned representative.");
    }
  }

  const createdAt = nowIso();
  const user: UserRecord = {
    id: uid("user"),
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: await bcrypt.hash(input.password, 10),
    role: input.role,
    assignedStreetId: input.role === "STREET_REP" ? input.assignedStreetId || null : null,
    isActive: true,
    createdAt,
    updatedAt: createdAt,
    deletedAt: null
  };

  demoStore.users.push(user);
  addAuditLog(session.id, "USER", user.id, "CREATE", `User ${user.email} created.`);
  return user;
}

export async function listFeeCycles(session: SessionUser) {
  ensureDemoMode();
  const cycles = sortCycles();

  if (session.role === "ADMIN") {
    return cycles;
  }

  return cycles;
}

export async function createFeeCycle(input: FeeCycleInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  if (demoStore.cycles.some((cycle) => cycle.month === input.month && cycle.year === input.year)) {
    throw new Error("A fee cycle already exists for this month and year.");
  }

  const cycleId = uid("cycle");
  const generatedAt = nowIso();
  const cycle = {
    id: cycleId,
    month: input.month,
    year: input.year,
    title: formatMonthYear(input.month, input.year),
    notes: input.notes ?? "",
    createdById: session.id,
    generatedAt
  };

  demoStore.cycles.push(cycle);

  activeHouses()
    .filter((house) => house.status === "ACTIVE")
    .forEach((house) => {
      const latestDue = getLatestDueForHouse(house.id);
      const openingBalance = latestDue?.balanceRemaining ?? house.openingBalance;
      const totalDue = house.monthlyFeeAmount + openingBalance;
      demoStore.dues.push({
        id: uid("due"),
        cycleId,
        houseId: house.id,
        amountDue: house.monthlyFeeAmount,
        openingBalance,
        totalDue,
        amountReceived: 0,
        balanceRemaining: totalDue,
        status: "PENDING",
        dueDate: new Date(input.year, input.month - 1, demoStore.settings.defaultDueDay).toISOString(),
        createdAt: generatedAt,
        updatedAt: generatedAt,
        deletedAt: null
      });
    });

  addAuditLog(session.id, "FEE_CYCLE", cycleId, "CREATE", `Generated cycle ${cycle.title}.`);
  return cycle;
}

export async function listDueRecords(
  session: SessionUser,
  filters: {
    search?: string;
    streetId?: string;
    month?: number;
    year?: number;
    status?: string;
  }
) {
  ensureDemoMode();
  const allowedStreetIds = accessibleStreetIds(session);
  const search = normalizeString(filters.search ?? "");

  return activeDues()
    .map((due) => {
      const house = getHouseByIdInternal(due.houseId);
      const street = getStreetById(house.streetId);
      const cycle = getCycleById(due.cycleId);
      const payments = demoStore.payments.filter((payment) => payment.feeDueId === due.id && !payment.deletedAt);
      return { ...due, house, street, cycle, payments };
    })
    .filter((due) => allowedStreetIds.includes(due.street.id))
    .filter((due) => (filters.streetId ? due.street.id === filters.streetId : true))
    .filter((due) => (filters.month ? due.cycle.month === filters.month : true))
    .filter((due) => (filters.year ? due.cycle.year === filters.year : true))
    .filter((due) => (filters.status ? due.status === filters.status : true))
    .filter((due) => {
      if (!search) {
        return true;
      }
      return [due.house.houseNumber, due.house.ownerName, due.house.mobile, due.street.number]
        .join(" ")
        .toLowerCase()
        .includes(search);
    })
    .sort((a, b) => {
      if (a.cycle.year !== b.cycle.year) {
        return b.cycle.year - a.cycle.year;
      }
      if (a.cycle.month !== b.cycle.month) {
        return b.cycle.month - a.cycle.month;
      }
      return a.house.houseNumber.localeCompare(b.house.houseNumber);
    });
}

export async function getCollectionsFormOptions(session: SessionUser) {
  const dueRecords = await listDueRecords(session, {});
  return dueRecords.filter((record) => record.balanceRemaining > 0);
}

export async function collectPayment(input: PaymentInput, session: SessionUser) {
  ensureDemoMode();
  const due = getDueById(input.feeDueId);
  const house = getHouseByIdInternal(due.houseId);
  ensureStreetAccess(session, house.streetId);

  if (due.balanceRemaining <= 0) {
    throw new Error("This due record is already fully paid.");
  }

  if (input.amountReceived > due.balanceRemaining) {
    throw new Error("Amount received cannot exceed the remaining balance.");
  }

  const paymentId = uid("payment");
  const createdAt = new Date(input.paymentDate).toISOString();
  const newAmountReceived = due.amountReceived + input.amountReceived;
  const newBalance = Math.max(due.totalDue - newAmountReceived, 0);

  demoStore.payments.push({
    id: paymentId,
    feeDueId: due.id,
    amount: input.amountReceived,
    paymentDate: createdAt,
    paymentMethod: input.paymentMethod,
    collectedById: session.id,
    notes: input.notes ?? "",
    createdAt,
    deletedAt: null
  });

  due.amountReceived = newAmountReceived;
  due.balanceRemaining = newBalance;
  due.status = computeDueStatus(due.totalDue, newAmountReceived);
  due.updatedAt = nowIso();

  const receipt = {
    id: uid("receipt"),
    paymentId,
    receiptNumber: createReceiptNumber(due.cycleId),
    balanceAfterPayment: newBalance,
    createdAt
  };

  demoStore.receipts.push(receipt);
  addAuditLog(
    session.id,
    "PAYMENT",
    paymentId,
    "CREATE",
    `Payment of ${input.amountReceived} recorded for ${house.houseNumber}.`
  );

  return receipt;
}

export async function getReceiptDetail(receiptId: string, session: SessionUser) {
  ensureDemoMode();
  const receipt = demoStore.receipts.find((item) => item.id === receiptId);

  if (!receipt) {
    throw new Error("Receipt not found.");
  }

  const payment = demoStore.payments.find((item) => item.id === receipt.paymentId && !item.deletedAt);
  if (!payment) {
    throw new Error("Payment record not found.");
  }

  const due = getDueById(payment.feeDueId);
  const house = getHouseByIdInternal(due.houseId);
  const street = getStreetById(house.streetId);
  const cycle = getCycleById(due.cycleId);
  const collector = activeUsers().find((user) => user.id === payment.collectedById);

  ensureStreetAccess(session, street.id);

  return {
    receipt,
    payment,
    due,
    house,
    street,
    cycle,
    collectorName: collector?.name ?? "Unknown"
  };
}

export async function verifyViewerAccess(input: {
  houseNumber: string;
  cnic: string;
  mobile: string;
}) {
  ensureDemoMode();
  const house = activeHouses().find(
    (item) => normalizeString(item.houseNumber) === normalizeString(input.houseNumber)
  );

  if (!house) {
    return null;
  }

  const resident = activeResidents().find(
    (item) =>
      item.houseId === house.id &&
      normalizeString(item.cnic) === normalizeString(input.cnic) &&
      normalizeString(item.mobile) === normalizeString(input.mobile)
  );

  if (!resident) {
    return null;
  }

  const street = getStreetById(house.streetId);
  const dues = activeDues()
    .filter((due) => due.houseId === house.id)
    .map((due) => ({ ...due, cycle: getCycleById(due.cycleId) }))
    .sort((a, b) => b.cycle.year - a.cycle.year || b.cycle.month - a.cycle.month);

  const receipts = demoStore.receipts
    .map((receipt) => {
      const payment = demoStore.payments.find((item) => item.id === receipt.paymentId && !item.deletedAt);
      if (!payment) {
        return null;
      }
      const due = demoStore.dues.find((item) => item.id === payment.feeDueId);
      if (!due || due.houseId !== house.id) {
        return null;
      }
      const cycle = getCycleById(due.cycleId);
      return { receipt, payment, due, cycle };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        new Date(b!.payment.paymentDate).getTime() - new Date(a!.payment.paymentDate).getTime()
    )
    .map((item) => ({
      id: item!.receipt.id,
      receiptNumber: item!.receipt.receiptNumber,
      houseNumber: house.houseNumber,
      streetNumber: street.number,
      month: item!.cycle.month,
      year: item!.cycle.year,
      amount: item!.payment.amount,
      paymentDate: item!.payment.paymentDate,
      pendingAfterPayment: item!.receipt.balanceAfterPayment
    }));

  return {
    resident,
    house,
    street,
    receipts,
    pendingTotal: dues.reduce((sum, due) => sum + due.balanceRemaining, 0)
  };
}

export async function getPendingDuesData(
  session: SessionUser,
  filters: { search?: string; streetId?: string; month?: number; year?: number }
) {
  const dueRecords = await listDueRecords(session, { ...filters });
  const pendingRecords = dueRecords.filter((record) => record.balanceRemaining > 0);
  const groupedByStreet = activeStreets()
    .filter((street) => pendingRecords.some((record) => record.street.id === street.id))
    .map((street) => {
      const records = pendingRecords.filter((record) => record.street.id === street.id);
      return {
        streetId: street.id,
        streetNumber: street.number,
        representativeName: getRepresentativeName(street.id),
        pendingAmount: records.reduce((sum, record) => sum + record.balanceRemaining, 0),
        houseCount: new Set(records.map((record) => record.house.id)).size
      };
    });

  return {
    pendingRecords,
    groupedByStreet,
    totalPending: pendingRecords.reduce((sum, record) => sum + record.balanceRemaining, 0)
  };
}

export async function adjustBalance(input: AdjustmentInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  const house = getHouseByIdInternal(input.houseId);
  const due = input.feeDueId ? getDueById(input.feeDueId) : getLatestDueForHouse(house.id);

  if (!due) {
    throw new Error("No due record found for this house.");
  }

  due.totalDue += input.amount;
  due.balanceRemaining = Math.max(due.totalDue - due.amountReceived, 0);
  due.status = computeDueStatus(due.totalDue, due.amountReceived);
  due.updatedAt = nowIso();

  demoStore.adjustments.push({
    id: uid("adjustment"),
    houseId: house.id,
    feeDueId: due.id,
    amount: input.amount,
    reason: input.reason,
    adjustedById: session.id,
    createdAt: nowIso()
  });

  addAuditLog(
    session.id,
    "BALANCE_ADJUSTMENT",
    due.id,
    "CREATE",
    `Adjusted balance for ${house.houseNumber} by ${input.amount}.`
  );

  return due;
}

export async function getRecoveryReport(
  session: SessionUser,
  filters: { month?: number; year?: number }
) {
  const dueRecords = await listDueRecords(session, filters);
  const streetMap = new Map<
    string,
    { streetId: string; streetNumber: string; expected: number; received: number; pending: number }
  >();
  const monthMap = new Map<
    string,
    { label: string; expected: number; received: number; pending: number }
  >();

  for (const record of dueRecords) {
    const streetEntry = streetMap.get(record.street.id) ?? {
      streetId: record.street.id,
      streetNumber: record.street.number,
      expected: 0,
      received: 0,
      pending: 0
    };
    streetEntry.expected += record.totalDue;
    streetEntry.received += record.amountReceived;
    streetEntry.pending += record.balanceRemaining;
    streetMap.set(record.street.id, streetEntry);

    const monthKey = `${record.cycle.year}-${record.cycle.month}`;
    const monthEntry = monthMap.get(monthKey) ?? {
      label: formatMonthYear(record.cycle.month, record.cycle.year),
      expected: 0,
      received: 0,
      pending: 0
    };
    monthEntry.expected += record.totalDue;
    monthEntry.received += record.amountReceived;
    monthEntry.pending += record.balanceRemaining;
    monthMap.set(monthKey, monthEntry);
  }

  return {
    streetRows: [...streetMap.values()].map((row) => ({
      ...row,
      recovery: row.expected > 0 ? Math.round((row.received / row.expected) * 100) : 0
    })),
    monthRows: [...monthMap.values()].map((row) => ({
      ...row,
      recovery: row.expected > 0 ? Math.round((row.received / row.expected) * 100) : 0
    }))
  };
}

export async function getHouseLedger(session: SessionUser, houseId?: string) {
  ensureDemoMode();
  const allowedStreetIds = accessibleStreetIds(session);
  const houses = activeHouses()
    .filter((house) => allowedStreetIds.includes(house.streetId))
    .map((house) => ({
      ...house,
      street: getStreetById(house.streetId)
    }))
    .sort((a, b) => a.houseNumber.localeCompare(b.houseNumber));

  const selectedHouse = houseId ? houses.find((house) => house.id === houseId) : houses[0];

  if (!selectedHouse) {
    return {
      houses,
      selectedHouse: null,
      rows: [],
      totalPending: 0
    };
  }

  const rows = activeDues()
    .filter((due) => due.houseId === selectedHouse.id)
    .map((due) => ({
      ...due,
      cycle: getCycleById(due.cycleId),
      payments: demoStore.payments.filter((payment) => payment.feeDueId === due.id && !payment.deletedAt)
    }))
    .sort((a, b) => a.cycle.year - b.cycle.year || a.cycle.month - b.cycle.month);

  return {
    houses,
    selectedHouse,
    rows,
    totalPending: rows.reduce((sum, row) => sum + row.balanceRemaining, 0)
  };
}

export async function getSettings(session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);
  return demoStore.settings;
}

export async function updateSettings(input: SettingsInput, session: SessionUser) {
  ensureDemoMode();
  requireAdmin(session);

  demoStore.settings.societyName = input.societyName;
  demoStore.settings.receiptPrefix = input.receiptPrefix;
  demoStore.settings.defaultDueDay = input.defaultDueDay;
  demoStore.settings.supportPhone = input.supportPhone;
  demoStore.settings.viewerNotice = input.viewerNotice;
  addAuditLog(session.id, "SETTINGS", "society-settings", "UPDATE", "Settings updated.");
  return demoStore.settings;
}

export async function getRecoveryCsvRows(session: SessionUser, filters: { month?: number; year?: number }) {
  const report = await getRecoveryReport(session, filters);

  return report.streetRows.map((row) => ({
    "Street Number": row.streetNumber,
    Expected: row.expected,
    Received: row.received,
    Pending: row.pending,
    "Recovery %": row.recovery
  }));
}
