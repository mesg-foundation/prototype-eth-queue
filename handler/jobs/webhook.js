import $axios from 'axios'

const t = () => new Date().toISOString()

export default (job, done) => {
  job.log('========== Sending new Webhook ==========')
  job.log(`${t()} [POST] ${job.data.url} with payload ${JSON.stringify(job.data.payload)}`)
  return $axios.post(job.data.url, job.data.payload, {
    headers: {
      'X-Eth-Queue-Secret': job.data.meta.secret
    }
  })
  .then(response => {
    job.log(`${t()} [STATUS] ${response.status}`)
    job.log(`${t()} [RESPONSE] ${response.data}`)
    done()
  })
  .catch(error => {
    job.log(`${t()} [ERROR] ${error}`)
    done(error)
  })
}