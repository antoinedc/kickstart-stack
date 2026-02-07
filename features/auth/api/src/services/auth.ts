/**
 * Authentication service for password hashing and JWT token management.
 * Uses argon2 for password hashing and jose for JWT operations.
 */

import { hash, verify } from '@node-rs/argon2'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './database.js'
import type { User, UserRole } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
)
const JWT_ISSUER = '{{PROJECT_NAME}}'
const JWT_AUDIENCE = '{{PROJECT_NAME}}-api'
const TOKEN_EXPIRY = '7d'

export interface TokenPayload {
  userId: string
  organizationId: string
  role: UserRole
  email: string
}

export interface AuthResult {
  user: Omit<User, 'passwordHash'>
  token: string
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  })
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return verify(passwordHash, password)
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  })

  return {
    userId: payload.userId as string,
    organizationId: payload.organizationId as string,
    role: payload.role as UserRole,
    email: payload.email as string,
  }
}

export interface SignupInput {
  email: string
  password: string
  name?: string
  organizationName: string
  locale?: string
}

export async function signup(input: SignupInput): Promise<AuthResult> {
  const { email, password, name, organizationName, locale = 'en' } = input

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new AuthError('User with this email already exists', 'USER_EXISTS')
  }

  const passwordHash = await hashPassword(password)

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: organizationName },
    })

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'ADMIN',
        locale,
        organizationId: organization.id,
      },
    })

    return { user, organization }
  })

  const token = await createToken({
    userId: result.user.id,
    organizationId: result.organization.id,
    role: result.user.role,
    email: result.user.email,
  })

  const { passwordHash: _, ...userWithoutPassword } = result.user

  return { user: userWithoutPassword, token }
}

export interface LoginInput {
  email: string
  password: string
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS')
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS')
  }

  const token = await createToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
    email: user.email,
  })

  const { passwordHash: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}

export async function getUserById(
  userId: string
): Promise<Omit<User, 'passwordHash'> | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { organization: true },
  })

  if (!user) return null

  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
