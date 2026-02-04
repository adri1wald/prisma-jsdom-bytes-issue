import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/test'

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })
