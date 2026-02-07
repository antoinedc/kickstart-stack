
### Background Jobs

- **Queue**: Redis + BullMQ for job processing
- **Redis**: `apps/api/src/services/redis.ts` — connection singleton
- **Queue**: `apps/api/src/services/queue.ts` — `createQueue(name)`, `createWorker(name, processor)`
- **Usage**:
  ```typescript
  const myQueue = createQueue('my-queue')
  await myQueue.add('job-name', { data: 'value' })

  createWorker('my-queue', async (job) => {
    console.log(job.data)
  })
  ```
- **Graceful shutdown**: `closeQueue()` called in server shutdown handler
