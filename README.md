# Work Society Management System

Simple, large-text Next.js application for residential society fee management, built for easy day-to-day use by admins, street representatives, and residents.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Shadcn-style UI primitives
- Prisma ORM schema prepared for PostgreSQL
- Custom cookie-based auth with role protection
- React Hook Form + Zod validation

## Current Mode

The app runs in `DEMO_MODE=true` by default, so the full UI and workflows work immediately without a live database.

- Prisma schema is included in [prisma/schema.prisma](/home/hp/Documents/personal-project/worksociety/prisma/schema.prisma)
- Seed data is included in [prisma/seed.ts](/home/hp/Documents/personal-project/worksociety/prisma/seed.ts)
- Runtime demo data and business rules live in [lib/demo-store.ts](/home/hp/Documents/personal-project/worksociety/lib/demo-store.ts) and [lib/repositories.ts](/home/hp/Documents/personal-project/worksociety/lib/repositories.ts)

## Main Routes

- `/login` admin and street representative login
- `/viewer` house owner verification portal
- `/dashboard` role-aware dashboard
- `/streets` street management
- `/houses` house management
- `/residents` resident records
- `/fee-cycles` monthly due generation
- `/collections` fee collection and receipt creation
- `/pending-dues` dues and balance adjustments
- `/reports/recovery` recovery reporting
- `/reports/ledger` house ledger
- `/users` user management
- `/imports/csv` CSV import placeholder
- `/settings` society settings

Legacy shortcuts also redirect:

- `/admin`
- `/collector`
- `/resident`

## Demo Access

### Admin

- Email: `admin@worksociety.test`
- Password: `Admin123!`

### Street Representative

- Email: `street1@worksociety.test`
- Password: `Street123!`

### Viewer Verification

- House number: `A-31`
- CNIC: `35202-1234567-1`
- Mobile: `0312-555-0101`

## Features Included

- Role-based protected routes
- Admin, street representative, and viewer flows
- Street, house, resident, and user management
- Monthly fee cycle generation
- Payment collection with partial payments
- Unique receipt generation and print-friendly receipt page
- Pending dues and balance adjustments with reason
- Street-wise recovery reporting and ledger views
- CSV import placeholder for old records
- Mobile-friendly accessible layout with large controls

## Commands

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

## Environment

Copy `.env.example` if needed. Default local setup already includes:

- `DEMO_MODE=true`
- placeholder `DATABASE_URL`
- local `AUTH_SECRET`

To switch from demo mode to a real PostgreSQL-backed setup, wire the repository layer to Prisma and run the Prisma migrations/seed flow against your database.
