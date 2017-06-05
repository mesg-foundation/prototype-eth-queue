import kue from 'kue'
import webhook from './jobs/webhook'

const queue = kue.createQueue({
  redis: {
    host: 'redis'
  }
})

queue.process(process.env.QUEUE_NAME, (job, done) => webhook.process(job, job.data, done))

queue.on('error', err => console.error(`ERROR: ${err}`))

queue.watchStuckJobs(process.env.STUCK_JOB_INTERVAL || 1000)

process.once('SIGTERM', sig => {
  queue.shutdown(5000, err => {
    console.log('Kue shutdown: ', err || '' )
    process.exit(0)
  })
})
