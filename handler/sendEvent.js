#!/usr/bin/env node

const Queue = require('./queue.js')

Queue.sendMessage(process.env.CHANNEL_NAME, {
  url: 'https://test.com',
  payload: {
    foo: 'bar'
  }
})

setTimeout(() => {
  Queue.disconnect()
  process.exit(0)
}, 500)