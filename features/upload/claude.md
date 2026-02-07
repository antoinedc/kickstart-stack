
### File Upload (S3)

- **Provider**: S3-compatible object storage (AWS S3, MinIO, etc.)
- **Service**: `apps/api/src/services/s3.ts`
  - `uploadFile(key, body, contentType)` — upload a file
  - `getSignedDownloadUrl(key, expiresIn)` — generate a presigned download URL
  - `deleteFile(key)` — delete a file
  - `getFileStream(key)` — get a readable stream
- **Multipart**: `@fastify/multipart` registered for file upload handling (100MB max)
- **Config**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`
