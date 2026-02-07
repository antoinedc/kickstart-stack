import Fastify from 'fastify'
import { connectDatabase, disconnectDatabase } from './services/database.js'
import { healthRoutes } from './routes/health.js'

const fastify = Fastify({
  logger: true,
})

async function start() {
  // Connect to database
  await connectDatabase()
  fastify.log.info('Connected to database')

  // Health routes (public, no auth required)
  await fastify.register(healthRoutes, { prefix: '/api' })

  const port = parseInt(process.env.PORT || '6001', 10)
  const host = process.env.HOST || '0.0.0.0'

  // Graceful shutdown
  const shutdown = async () => {
    fastify.log.info('Shutting down...')
    await fastify.close()
    await disconnectDatabase()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  try {
    await fastify.listen({ port, host })
    console.log(`Server listening on ${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
