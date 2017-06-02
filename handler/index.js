const $axios = require('axios')
const Queue = require('./queue.js')

Queue.onMessage(process.env.CHANNEL_NAME, ({url, payload}) => new Promise((resolve, reject) => {
  console.log(`receiver ${url}, with payload ${payload}`)
  $axios.post(url, payload)
  .then(response => {
    console.log(response.data)
    resolve(response)
  })
  .catch(error => {
    console.error(error)
    reject(error)
  })
}))
