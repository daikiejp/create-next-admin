# Create Next Admin

[![Version](https://img.shields.io/npm/v/create-next-admin.svg)](https://www.npmjs.com/package/create-next-admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: daikiejp](https://img.shields.io/twitter/follow/daikiejp.svg?style=social)](https://twitter.com/daikiejp)

A Next Admin Dashboard installer that uses NextJS as a framework, next-intl for internationalization, prisma as an ORM and nextAuth for authentication, ready to use.

## Usage

npx

```bash
npx create-next-admin@latest --with-template
```

pnpm

```bash
pnpx dlx create-next-admin@latest --with-template
```

or non-interactive mode:

```bash
npx create-next-admin@latest --name mydashboard --package npm --with-template
```

or

```bash
npx create-next-admin@latest -n mydashboard -p npm --with-template
```

Then, `Go to Dashboard` and register a new user.

- If you want a very **simple Auth Login** without a dashboard sample just remove `--with-template` argument.

## Dependencies

- Next.js (React Framework)
- TailwindCSS (CSS Framework)
- Shadcn (UI Components collection)
- next-intl (Internationalization)
- next-themes (Theme provider)
- Auth.js (Authentication)
- Prisma (ORM)

## NextJS Options

| Question          | Answer |
| ----------------- | ------ |
| Typescript        | ✅ Yes |
| ESLint            | ✅ Yes |
| Tailwind CSS      | ✅ Yes |
| src/ directory    | ❌ No  |
| App Router        | ✅ Yes |
| Turbopack         | ✅ Yes |
| import alias @/\* | ✅ Yes |

# Log out

Logout is implemented and functional in the sidebar menu. But if you want to implement it as a button for your project you can use the `logoutButton.tsx` component.

# Deploy

If you want to deploy on Serverless provider such as Vercel you need change only **one file at**: `prisma/schema.prisma`

1. You need change your "sqlite" into a "postgresql"
2. You need add directUrl in order to work with prisma
   Your prisma config example:

```prisma
...
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
directUrl = env("DIRECT_URL")
}
...
```

Then in Vercel go to your Project Settings > Environment Variables you need have **3 environments**:
   - AUTH_SECRET
   - DATABASE_URL
   - DIRECT_URL
4. The Auth Secret you can generate a new one by: `openssl rand -base64 32` or here: `https://generate-secret.vercel.app/32`
5. The Database Url and Direct Url you can get from your database provider, example: Supabase

# Todo

1. Create a dynamic Breadcrumb using the url as path
2. Admin section using role Admin  
~~3. Create a better Dashboard with example data~~  
~~4. Create a better Admin Area~~  
~~5. Support internationalization for zod validations~~  
~~6. Support install offline mode~~  
~~7. Support non-interactive commands~~  

## Status

Stable version 15.3.2

## Author

👤 **Danny Davila**

- Website: [daikie.jp](https://daikie.jp)
- X (formely Twitter): [@daikiejp](https://x.com/daikiejp)
- Github: [@daikiejp](https://github.com/daikiejp)

## License

MIT License. Read more at [LICENSE.md](LICENSE.md)
