import $axios from 'axios'

const process = (job, { url, payload }, done) => {
  job.log(`POST: ${url} with payload ${JSON.stringify(payload)}`)
  $axios.post(url, payload)
  .then(response => {
    job.log(`SUCCESS: ${response.status}`)
    job.log(`RESPONSE: ${response.data}`)
    done()
  })
  .catch(error => {
    job.log(`ERROR: ${error}`)
    done(error)
  })
}

export default {
  process
}