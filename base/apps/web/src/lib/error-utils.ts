import type { ErrorCode } from '@{{PROJECT_NAME}}/shared'
import { ApiError } from './api'

export function getErrorCode(error: unknown): ErrorCode | 'generic' {
  if (error instanceof ApiError && error.code) {
    return error.code as ErrorCode
  }
  return 'generic'
}
