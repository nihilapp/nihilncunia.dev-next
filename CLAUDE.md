# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `app/(auth)/` - Authentication-related pages and server actions
- `app/(blog)/` - Blog content pages (posts, categories, tags)
- `app/(blog_admin)/` - Blog administration pages
- `app/(admin)/` - System administration pages
- `app/api/` - API routes with JWT authentication

#### Core Directories

- `app/_entities/` - Domain-specific modules (auth, profiles, etc.)
  - Each entity has: `index.ts`, `*.api.ts`, `*.store.ts`, `*.keys.ts`, `*.types.ts`, `*.table.ts`, `hooks/`
- `app/_libs/` - Utility functions and tools
  - `app/_libs/server/` - Server-side utilities (response, supabase client)
  - `app/_libs/tools/` - Utility tools (bcrypt, date, logger, etc.)
- `app/_components/` - Shared components (use index.ts for exports)
- `app/_data/` - Static data and constants
- `app/_sql/` - Drizzle migrations, triggers, and views
- `app/_config/` - Site configuration and settings
- `app/_icons/` - Icon assets and exports
- `app/_images/` - Image assets
- `app/_layouts/` - Layout providers (React Query, Zustand)
- `app/_styles/` - Global CSS and styling configurations
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
- Separate variable declarations from functions, conditionals, loops, etc. with blank lines
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

#### Server Actions & API Development

- **Server Actions**: Primary method for form handling and mutations (API routes not used)
  - File naming: `*.action.ts` for server actions
  - Location: `app/(route)/_actions/` directories for route-specific actions
  - Route-specific actions: Actions only used in specific routes go in that route's `_actions/` folder
  - Main action files: `*.action.ts` files contain the primary action functions
  - Helper actions: Supporting functions in separate files (e.g., `send-code.ts`, `verify-code.ts`)
  - Return type: `Promise<FormState>` for form actions
  - Usage: Import and use with `useActionState` in client components
  - Error handling with Logger utility
- **API Routes**: Legacy - avoid using, prefer server actions
  - Import structure: NextRequest/NextResponse, DB from `@/_libs/server`
  - Response format: `ApiResponse<T>` for success, `ApiError` for errors
  - Error handling: 400 (bad request), 401 (auth), 404 (not found), 409 (conflict), 500 (server)

#### React Query Patterns

- GET hooks: `useGet...` with useLoading/useDone from `@/_entities/common`
- Mutations: `useCreate...`, `useUpdate...`, `useDelete...`
- Return structure: `{ data, loading, done, ...other }`
- Automatic query invalidation on mutations

### Import Aliases

- `@/` - Points to `app/` directory

### Language & Communication

- All responses and error messages in Korean
- Use Korean for user-facing content and comments

### Authentication & Security

- **Authentication System**: Supabase Auth with custom guard system
  - Two-factor authentication with OTP (using otplib)
  - Server actions for auth flow (`passcode.action.ts`, `guard-complete.action.ts`)
  - Role-based access control (USER, ADMIN, SUPER_ADMIN)
  - bcrypt for password hashing
  - Zustand store for auth state management

## Current Status & Notes

### Active Migration
- **Branch**: `migration-to-server-action`
- **Status**: Migrating authentication system to Next.js server actions
- **Completed**: OTP guard system, passcode verification, auth flow redesign
- **In Progress**: Callback URL handling and auth completion flow

### Key Updates
- ✅ Drizzle ORM migration from Prisma completed
- ✅ Server actions implementation for authentication
- ✅ Two-factor authentication with OTP integration  
- ✅ Enhanced logging system with Logger utility
- 🔄 Authentication flow callback handling optimization

### Technical Notes
- Uses pnpm workspaces configuration
- ESLint configured with strict TypeScript rules
- Tailwind CSS v4 with custom styling architecture
- React 19 and Next.js 15 with App Router
