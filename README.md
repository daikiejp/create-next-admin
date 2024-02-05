# Create Next Admin

[![Version](https://img.shields.io/npm/v/create-next-admin.svg)](https://www.npmjs.com/package/create-next-admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: daikiejp](https://img.shields.io/twitter/follow/daikiejp.svg?style=social)](https://twitter.com/daikiejp)

A Next Admin Dashboard installer that uses NextJS as a framework, next-intl for internationalization, prisma as an ORM and nextAuth for authentication, ready to use.

## Usage

```
npx create-next-admin@latest
```

Then, `Go to Dashboard` and register a new user.

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

# Admin Section

The admin section is under: `/admin` and is currently on development.

# Todo

1. Create a better Dashboard with example data
2. Create a better Admin Area
3. Support internationalization for zod validations
4. Create a dynamic Breadcrumb using the url as path
5. Support install offline mode
6. Support non-interactive commands

## Status

Unstable version. This project is for development use only.

## Author

👤 **Danny Davila**

- Website: [daikie.jp](https://daikie.jp)
- X (formely Twitter): [@daikiejp](https://x.com/daikiejp)
- Github: [@daikiejp](https://github.com/daikiejp)

## License

MIT License. Read more at [LICENSE.md](LICENSE.md)
