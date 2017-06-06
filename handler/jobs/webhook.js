import $axios from 'axios'

const t = () => new Date().toISOString()

const process = (job, { url, payload }, done) => {
  job.log('========== Sending new Webhook ==========')
  job.log(`${t()} [POST] ${url} with payload ${JSON.stringify(payload)}`)
  $axios.post(url, payload)
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

export default {
  process
}