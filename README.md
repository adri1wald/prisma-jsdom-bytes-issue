# Prisma Bytes Field Fails in jsdom Environment

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
