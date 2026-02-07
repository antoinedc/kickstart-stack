
### Authentication

- **Backend**: JWT with email/password, argon2 hashing, jose for tokens
- **Frontend**: Zustand store with localStorage persistence
- **Endpoints**: POST `/api/auth/signup`, POST `/api/auth/login`, GET `/api/auth/me`
- **Protected routes**: Use `{ preHandler: [fastify.authenticate] }` on route options
- **Admin routes**: Use `{ preHandler: [fastify.requireAdmin] }`
- **Frontend auth**: `useAuth()` hook for login/signup/logout, `useAuthStore()` for state
- **Locale sync**: On login, DB locale is used if localStorage is empty (device preference wins)
- **Token expiry**: 7 days, stored in localStorage
- **Error codes**: `AUTH_INVALID_CREDENTIALS`, `AUTH_USER_EXISTS`, `AUTH_MISSING_TOKEN`, `AUTH_INVALID_TOKEN`, `AUTH_ADMIN_REQUIRED`
