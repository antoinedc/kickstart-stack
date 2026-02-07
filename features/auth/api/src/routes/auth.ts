/**
 * Authentication routes: signup, login, and /me endpoints.
 */

import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { signup, login, getUserById, AuthError } from '../services/auth.js'
import {
  AUTH_USER_EXISTS,
  AUTH_INVALID_CREDENTIALS,
  AUTH_USER_NOT_FOUND,
  VALIDATION_ERROR,
  INTERNAL_ERROR,
} from '@{{PROJECT_NAME}}/shared'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).optional(),
  organizationName: z.string().min(1, 'Organization name is required'),
  locale: z.enum(['en', 'fr', 'it']).default('en'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/signup', async (request, reply) => {
    const parseResult = signupSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply.status(400).send({
        code: VALIDATION_ERROR,
        field: parseResult.error.errors[0].path[0],
      })
    }

    try {
      const result = await signup(parseResult.data)
      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof AuthError) {
        const statusCode = error.code === 'USER_EXISTS' ? 409 : 400
        return reply.status(statusCode).send({
          code: error.code === 'USER_EXISTS' ? AUTH_USER_EXISTS : VALIDATION_ERROR,
        })
      }
      fastify.log.error(error)
      return reply.status(500).send({ code: INTERNAL_ERROR })
    }
  })

  fastify.post('/login', async (request, reply) => {
    const parseResult = loginSchema.safeParse(request.body)

    if (!parseResult.success) {
      return reply.status(400).send({
        code: VALIDATION_ERROR,
        field: parseResult.error.errors[0].path[0],
      })
    }

    try {
      const result = await login(parseResult.data)
      return reply.send(result)
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(401).send({ code: AUTH_INVALID_CREDENTIALS })
      }
      fastify.log.error(error)
      return reply.status(500).send({ code: INTERNAL_ERROR })
    }
  })

  fastify.get(
    '/me',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = await getUserById(request.user.userId)

      if (!user) {
        return reply.status(404).send({ code: AUTH_USER_NOT_FOUND })
      }

      return reply.send({ user })
    }
  )
}
