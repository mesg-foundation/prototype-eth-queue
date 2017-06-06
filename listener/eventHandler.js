import kue from "kue"

const queue = kue.createQueue({
  redis: {
    host: 'redis'
  }
})

export default event => queue.create(process.env.QUEUE_NAME, {
    title: `[${event.meta.name}] ${event.meta.address}`,
    meta: event.meta,
    url: event.meta.endpoint,
    payload: event.args
  })
  .attempts(10)
  .backoff({ type: 'exponential' })
  .save()