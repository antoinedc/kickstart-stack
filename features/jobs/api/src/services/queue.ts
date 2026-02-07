import { Queue, Worker } from 'bullmq'
import { redis } from './redis.js'

const connection = { connection: redis }
const workers: Worker[] = []

export function createQueue(name: string) {
  return new Queue(name, connection)
}

export function createWorker<T>(
  name: string,
  processor: (job: { data: T; id?: string }) => Promise<void>
) {
  const worker = new Worker(name, processor, connection)
  workers.push(worker)
  return worker
}

export async function closeQueue() {
  await Promise.all(workers.map((w) => w.close()))
}
