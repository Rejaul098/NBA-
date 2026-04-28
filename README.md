# Flashlink

Anonymous, random-only URL shortener built with `Next.js`, `TypeScript`, `Prisma`, and managed `PostgreSQL`.

## Stack

- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL` via a managed provider such as `Neon`
- Deploy on `Vercel`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. Add your managed Postgres connection string to `DATABASE_URL`.

4. Push the schema:

```bash
npm run db:push
```

If you want Prisma migrations in environments beyond local setup, run:

```bash
npm run db:migrate
```

5. Start the app:

```bash
npm run dev
```

## Environment variables

- `DATABASE_URL`: Managed Postgres connection string
- `NEXT_PUBLIC_APP_URL`: Base URL for generated links

## Product scope

- Anonymous link creation
- Random short-code generation
- Redirect resolution
- Click counting
- Click event logging
- Basic in-memory rate limiting

For production abuse protection on Vercel, the next upgrade is moving rate limiting to Redis or Upstash.

## Deployment notes

- Create a managed `PostgreSQL` database such as `Neon`
- Set `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` in `Vercel`
- Run `npm run db:migrate` against the production database
- Visit `/api/health` after deploy to confirm DB connectivity
