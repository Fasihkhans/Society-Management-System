import bcrypt from "bcryptjs";
import {
  PrismaClient,
  DueStatus,
  HouseStatus,
  PaymentMethod,
  ResidentType,
  RoleName
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: { description: "Full system access" },
    create: { name: RoleName.ADMIN, description: "Full system access" }
  });

  const repRole = await prisma.role.upsert({
    where: { name: RoleName.STREET_REP },
    update: { description: "Assigned street access only" },
    create: { name: RoleName.STREET_REP, description: "Assigned street access only" }
  });

  const streetOne = await prisma.street.upsert({
    where: { number: "1" },
    update: {},
    create: {
      number: "1",
      name: "Main Gate Street",
      notes: "High recovery area near community gate."
    }
  });

  const streetTwo = await prisma.street.upsert({
    where: { number: "2" },
    update: {},
    create: {
      number: "2",
      name: "Park View Street",
      notes: "Mixed owners and tenants."
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@worksociety.test" },
    update: {},
    create: {
      name: "Society Admin",
      email: "admin@worksociety.test",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      roleId: adminRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: "street1@worksociety.test" },
    update: {},
    create: {
      name: "Muhammad Junaid",
      email: "street1@worksociety.test",
      passwordHash: await bcrypt.hash("Street123!", 10),
      roleId: repRole.id,
      assignedStreetId: streetOne.id
    }
  });

  const house = await prisma.house.upsert({
    where: {
      streetId_houseNumber: {
        streetId: streetOne.id,
        houseNumber: "A-31"
      }
    },
    update: {},
    create: {
      streetId: streetOne.id,
      houseNumber: "A-31",
      ownerName: "Rashid Iqbal",
      cnic: "35202-1234567-1",
      mobile: "0312-555-0101",
      ownerEmail: "rashid@example.com",
      status: HouseStatus.ACTIVE,
      monthlyFeeAmount: 1000,
      openingBalance: 1000,
      notes: "Seeded viewer demo house."
    }
  });

  await prisma.resident.upsert({
    where: { id: "seed-resident-a31" },
    update: {},
    create: {
      id: "seed-resident-a31",
      houseId: house.id,
      fullName: "Rashid Iqbal",
      residentType: ResidentType.OWNER,
      cnic: "35202-1234567-1",
      mobile: "0312-555-0101",
      email: "rashid@example.com",
      isPrimary: true,
      verificationEnabled: true
    }
  });

  const cycle = await prisma.monthlyFeeCycle.upsert({
    where: {
      month_year: {
        month: 4,
        year: 2026
      }
    },
    update: {},
    create: {
      month: 4,
      year: 2026,
      title: "April 2026",
      notes: "Seed cycle",
      createdById: adminUser.id
    }
  });

  const feeDue = await prisma.feeDue.upsert({
    where: {
      cycleId_houseId: {
        cycleId: cycle.id,
        houseId: house.id
      }
    },
    update: {},
    create: {
      cycleId: cycle.id,
      houseId: house.id,
      amountDue: 1000,
      openingBalance: 1000,
      totalDue: 2000,
      amountReceived: 1000,
      balanceRemaining: 1000,
      status: DueStatus.PARTIAL,
      dueDate: new Date("2026-04-10")
    }
  });

  const payment = await prisma.payment.create({
    data: {
      feeDueId: feeDue.id,
      amount: 1000,
      paymentDate: new Date("2026-04-04"),
      paymentMethod: PaymentMethod.CASH,
      collectedById: adminUser.id,
      notes: "Seed payment"
    }
  });

  await prisma.receipt.create({
    data: {
      paymentId: payment.id,
      receiptNumber: "WS-202604-0001",
      balanceAfterPayment: 1000
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      entityType: "SEED",
      entityId: payment.id,
      action: "CREATE",
      details: {
        message: "Seeded initial payment and receipt."
      }
    }
  });

  await prisma.house.upsert({
    where: {
      streetId_houseNumber: {
        streetId: streetTwo.id,
        houseNumber: "A-49"
      }
    },
    update: {},
    create: {
      streetId: streetTwo.id,
      houseNumber: "A-49",
      ownerName: "Faisal Javed",
      cnic: "35202-3334445-6",
      mobile: "0302-555-0201",
      status: HouseStatus.ACTIVE,
      monthlyFeeAmount: 1000,
      openingBalance: 0,
      notes: "Additional seed house"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
