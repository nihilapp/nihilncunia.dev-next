# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Development Commands

### Package Management

- Use `pnpm` for all package operations (install, add, remove, etc.)

### Development & Build

- `pnpm serve` - Development server (includes cache cleanup)
- `pnpm build` - Production build (includes cache cleanup)
- `pnpm start` - Production server (builds first)
- `pnpm vercel:build` - Vercel deployment build (runs migrations first)

### Database Operations

- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:check` - Check migration files
- `pnpm db:typegen` - Generate Supabase types

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM (migrated from Prisma)
- **Authentication**: Supabase Auth
- **State Management**: Zustand v5
- **Forms**: react-hook-form with Zod validation
- **Data Fetching**: TanStack React Query v5 with Axios
- **Styling**: Tailwind CSS v4, shadcn/ui, class-variance-authority
- **Language**: TypeScript with ES modules

### Project Structure

#### Route Groups

- `app/(common)/` - Public pages and shared components
- `app/(auth)/` - Authentication-related pages
- `app/api/` - API routes with JWT authentication

#### Core Directories

- `app/_entities/` - Domain-specific modules (auth, profiles, etc.)
  - Each entity has: `index.ts`, `*.api.ts`, `*.store.ts`, `*.keys.ts`, `*.types.ts`, `hooks/`
- `app/_libs/` - Utility functions and tools
- `app/_components/` - Shared components (use index.ts for exports)
- `app/_data/` - Static data and constants
- `app/_sql/` - Drizzle migrations, triggers, and views
- `app/api/_libs/` - API utilities and helpers

#### Database Schema

- Uses Drizzle ORM with PostgreSQL
- Schema files: `app/_entities/**/*.table.ts`
- Migrations: `app/_sql/migrations/`
- Supabase integration with custom triggers and views

### Development Conventions

#### File Naming

- General files: kebab-case (`user-profile.ts`)
- React components: PascalCase (`UserProfile.tsx`)
- Folders: kebab-case
- Always include `index.ts` in component/layout folders with explicit exports

#### Component Guidelines

- Use shadcn/ui components from `app/(common)/_components/ui/`
- Page components must export default and include metadata
- Server components by default (avoid `use client` in pages)
- Use class-variance-authority for custom components

#### Code Formatting

- **Statement Spacing**: Add blank lines between different types of statements
- Variable declarations can be grouped together without blank lines
- Separate variable declarations from functions, conditionals, loops, etc. with a blank line
- Example:

  ```typescript
  const a = 1;
  const b = 2;
  const c = 3;

  function example() {
    return a + b + c;
  }

  if (condition) {
    // logic
  }
  ```

#### API Development

- All routes require JWT authentication except GET requests
- Import structure: NextRequest/NextResponse, DB from `@/_libs/server`
- Response format: `ApiResponse<T>` for success, `ApiError` for errors
- Error handling: 400 (bad request), 401 (auth), 404 (not found), 409 (conflict), 500 (server)

#### React Query Patterns

- GET hooks: `useGet...` with useLoading/useDone from `@/_entities/common`
- Mutations: `useCreate...`, `useUpdate...`, `useDelete...`
- Return structure: `{ data, loading, done, ...other }`
- Automatic query invalidation on mutations

#### Next.js 15 Dynamic Route Params

- In Next.js 15, the `params` object for dynamic routes is resolved asynchronously.
- Therefore, when defining props for a page component, the `params` type must be wrapped in a `Promise`.
- **Example**:

  ```typescript
  interface Props {
    params: Promise<{ slug: string }>;
  }

  export default async function Page({ params }: Props) {
    const { slug } = await params;
    // ...
  }
  ```

### Import Aliases

- `@/` - Points to `app/` directory

### Language & Communication

- All responses and error messages in Korean
- Use Korean for user-facing content and comments

### Authentication & Security

- Supabase Auth integration
- JWT token validation on API routes
- bcrypt for password hashing
- Role-based access control (USER, ADMIN, SUPER_ADMIN)

## Tool Usage Guide

> **Important**: To enhance maintainability and consistency, you should **actively use the helper functions** provided in `app/_libs/tools`. Before implementing new utility functions, always check if a suitable helper already exists.

### Date/Time Utility: `tools.date`

- Provides Day.js-based utilities for date conversion, calendar data, and formatting.
- **Example**:
  ```ts
  const now = tools.date.getNowDate();
  const dateInfo = tools.date.getDateInfo();
  const monthArr = tools.date.monthArray();
  const formatted = tools.date.dateToFormat(new Date());
  ```

### Encryption Utility: `tools.bcrypt`

- Use these methods for password hashing and verification instead of implementing them directly.
- **Example**:
  ```ts
  const hash = await tools.bcrypt.dataToHash("password");
  const isValid = await tools.bcrypt.dataCompare(hash, "password");
  ```

### Cookie Utility: `tools.cookie`

- Handle server-side cookie manipulation consistently through `tools.cookie`.
- **Example**:
  ```ts
  await tools.cookie.set("token", "abc", 3600);
  const token = await tools.cookie.get("token");
  await tools.cookie.remove("token");
  ```

### General Guidelines

- When adding a new utility, you must add its signature and usage examples to this guide.
- Even when direct implementation is necessary, prioritize reviewing and reusing existing helpers.

## Notes

- Project is transitioning from Prisma to Drizzle ORM
- Uses pnpm workspaces configuration
- ESLint configured with strict TypeScript rules
- Tailwind CSS v4 with custom styling architecture
