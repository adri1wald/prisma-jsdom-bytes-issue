# Prisma Bytes Field Fails in jsdom Environment

Minimal reproduction for a bug where Prisma's `@prisma/adapter-pg` fails to handle `Bytes` fields when running tests in a jsdom environment (e.g., Vitest with `environment: 'jsdom'`).

## The Problem

When using Vitest with `environment: 'jsdom'`, creating or reading records with `Bytes` fields fails with:

```
Expected a byte array in column 'content', got object: Hello, World!
```

## Root Cause

jsdom creates its own JavaScript realm with separate built-in classes (`Uint8Array`, `Buffer`, etc.). When code running in jsdom creates a `Uint8Array` or `Buffer`, the resulting object fails `instanceof Uint8Array` checks in Node's realm where `@prisma/adapter-pg` runs.

```js
// In jsdom environment:
const buf = Buffer.from('test')
console.log(buf instanceof Uint8Array) // false! (different realms)
```

## Reproduction

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
npm run db:setup

# 3. Run tests (will fail)
npm test

# 4. Run with node environment (will pass)
npm run test:node

# 5. Cleanup
npm run db:teardown
```

## Expected Behavior

`Bytes` fields should work the same regardless of the test environment.

## Workaround

Use `@vitest-environment node` directive in test files, or configure Vitest to use `node` environment for server tests:

```ts
/**
 * @vitest-environment node
 */
import { test } from 'vitest'
// ... tests work correctly
```

## Suggested Fix

Use realm-agnostic type checks in `@prisma/adapter-pg`:

```js
// Instead of:
value instanceof Uint8Array

// Use:
ArrayBuffer.isView(value) || Object.prototype.toString.call(value) === '[object Uint8Array]'
```

## Environment

- Prisma: 7.3.0
- @prisma/adapter-pg: 7.3.0
- Vitest: 3.x
- jsdom: 26.x
- Node.js: 22.x
- PostgreSQL: 16
