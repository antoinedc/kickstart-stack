/**
 * Fastify authentication plugin.
 * Adds authenticate decorator and request.user for protected routes.
 */

import fp from 'fastify-plugin'
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken, type TokenPayload } from '../services/auth.js'
import {
  AUTH_MISSING_TOKEN,
  AUTH_INVALID_TOKEN,
  AUTH_ADMIN_REQUIRED,
} from '@{{PROJECT_NAME}}/shared'

declare module 'fastify' {
  interface FastifyRequest {
    user: TokenPayload
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
    requireAdmin: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const authHeader = request.headers.authorization

      if (!authHeader) {
        return reply.status(401).send({
          code: AUTH_MISSING_TOKEN,
        })
      }

      const [scheme, token] = authHeader.split(' ')

      if (scheme !== 'Bearer' || !token) {
        return reply.status(401).send({
          code: AUTH_MISSING_TOKEN,
        })
      }

      try {
        const payload = await verifyToken(token)
        request.user = payload
      } catch (error) {
        return reply.status(401).send({
          code: AUTH_INVALID_TOKEN,
        })
      }
    }
  )

  fastify.decorate(
    'requireAdmin',
    async function (request: FastifyRequest, reply: FastifyReply) {
      await fastify.authenticate(request, reply)

      if (reply.sent) return

      if (request.user.role !== 'ADMIN') {
        return reply.status(403).send({
          code: AUTH_ADMIN_REQUIRED,
        })
      }
    }
  )
}

export default fp(authPlugin, {
  name: 'auth',
})
