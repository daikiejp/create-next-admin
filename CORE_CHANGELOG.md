# CORE CHANGELOG

## 15.5.5 (NextJS v15.5.3)

- Tested: bun installer and yarn installer | Works OK
- Add: Core Changelog
- Fix: bug with executors in pnpm, must need dlx for shadcn
  `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "shadcn@latest" not found

## 15.5.4 (NextJS v15.5.3)

- Add: package.json build for don't forget build before npm publish
- Fix: dist execution not generated

## 15.5.3

- Add: New NextJS version v15.5.3
- Update: Core script
  - Not longer fetch from Github (due need build first), now local repo is used instead
  - Support install current directory
  - Better templates installation for Dashboard (install dependencies)

## 15.3.2

- Add: New NextJS version v15.3.2
- Remove: yarn and bun command until tested
- Fix: Auth error validation message
- Add: Custom colors for chart in Dashboard
