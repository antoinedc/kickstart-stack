// Generic error codes
export const VALIDATION_ERROR = 'VALIDATION_ERROR' as const
export const INTERNAL_ERROR = 'INTERNAL_ERROR' as const
export const NOT_FOUND = 'NOT_FOUND' as const

export type ErrorCode =
  | typeof VALIDATION_ERROR
  | typeof INTERNAL_ERROR
  | typeof NOT_FOUND
