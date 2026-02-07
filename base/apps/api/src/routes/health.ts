import type { FastifyPluginAsync } from 'fastify'
import { prisma } from '../services/database.js'

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`

      // Check migration status
      let migrationStatus: { status: string; pending: string[]; appliedCount: number } = {
        status: 'unknown',
        pending: [],
        appliedCount: 0,
      }

      try {
        const migrations = await prisma.$queryRaw<
          Array<{ migration_name: string; finished_at: Date | null }>
        >`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at`

        const applied = migrations.filter((m) => m.finished_at !== null)
        const pending = migrations
          .filter((m) => m.finished_at === null)
          .map((m) => m.migration_name)

        migrationStatus = {
          status: pending.length > 0 ? 'pending' : 'up-to-date',
          pending,
          appliedCount: applied.length,
        }
      } catch {
        migrationStatus = { status: 'no-migrations-table', pending: [], appliedCount: 0 }
      }

      return reply.send({
        status: 'healthy',
        database: 'connected',
        migrations: migrationStatus,
      })
    } catch (error) {
      return reply.status(503).send({
        status: 'unhealthy',
        database: 'disconnected',
        error: String(error),
      })
    }
  })

  fastify.get('/health/simple', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return reply.send({ status: 'ok' })
    } catch {
      return reply.status(503).send({ status: 'error' })
    }
  })
}
