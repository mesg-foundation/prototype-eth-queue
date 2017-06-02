const $amqp = require('amqplib/callback_api')

const RABBITMQ_ADDRESS = `amqp://rabbitmq`
const ENCODING = 'utf-8'

const decode = message => JSON.parse(message.content.toString(ENCODING))

const encode = payload => new Buffer(JSON.stringify(payload), ENCODING)

const AMQPconnection = new Promise((resolve, reject) => {
  $amqp.connect(RABBITMQ_ADDRESS, (err, connection) => err ? reject(err) : resolve(connection))
})

const connect = () => new Promise((resolve, reject) => {
  AMQPconnection
  .then(connection => {
    connection.createChannel((err, channel) => {
      if (err) { return reject(err) }

      // channel.prefetch(1) // to dispatch between multiple workers

      resolve(channel)
    })
  })
  .catch(error => {
    setTimeout(() => {
      console.error(`Cannot connect to ${RABBITMQ_ADDRESS}`)
      console.error(error)
      process.exit(100)
    }, 500)
  })
})

const onMessage = (queue, callback) => {
  connect()
  .then(channel => {
    channel.assertQueue(queue, { durable: true })
    channel.consume(queue, message => {
      callback(decode(message))
      .then(() => channel.ack(message))
      .catch(() => channel.ack(message))
    }, { noAck: false })
  })
}

const sendMessage = (queue, message) => {
  connect()
  .then(channel => {
    channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, encode(message), { persistent: true })
  })
}

const disconnect = () => AMQPconnection.then(connection => connection.close())

module.exports = {
  onMessage,
  sendMessage,
  disconnect
}