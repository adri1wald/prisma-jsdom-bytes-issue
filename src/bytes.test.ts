import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from './db'

describe('Prisma Bytes field with jsdom', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.document.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create and read a document with Bytes field', async () => {
    // This demonstrates the jsdom realm issue:
    // - In jsdom, Buffer.from() creates a Buffer in jsdom's realm
    // - Prisma's pg adapter uses `instanceof Uint8Array` checks
    // - These checks fail because jsdom's Uint8Array !== Node's Uint8Array

    const content = Buffer.from('Hello, World!')

    // Log type info for debugging
    console.log('Buffer type:', content.constructor.name)
    console.log('instanceof Uint8Array:', content instanceof Uint8Array)

    // Create document - may fail on write or read depending on Prisma version
    const doc = await prisma.document.create({
      data: {
        name: 'test.txt',
        content,
      },
    })

    expect(doc.name).toBe('test.txt')

    // Read it back - this is where the error typically occurs
    const found = await prisma.document.findUnique({
      where: { id: doc.id },
    })

    expect(found).not.toBeNull()
    expect(found!.content).toBeInstanceOf(Uint8Array)
  })
})
