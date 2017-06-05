const Web3 = require("web3")
const kue = require('kue')
const contract = require("truffle-contract")
const provider = new Web3.providers.HttpProvider("http://parity:8545")

const queue = kue.createQueue({
  redis: {
    host: 'redis'
  }
})

const MyContract = contract({
  abi: require("./abi.json"),
})
MyContract.setProvider(provider)

console.log(process.env.CONTRACT_ADDRESS)

MyContract.at(process.env.CONTRACT_ADDRESS)
.then(instance => {
  console.log("contract loaded")
  console.log("listen for event")

  //listen to Transfer event from a specific event parameter 'from', from contract from block 0 to the lastest block
  instance.contract.Transfer({
    // from: "0x2081254105402d9070945174b5f45e2df3b69e56",
  }, {
    fromBlock: 0,
    toBlock: 'latest'
  }, (error, event) => {
    console.log("event received")
    if (error) {
      console.log(error)
    }
    else {
      console.log(event)
      queue.create(process.env.QUEUE_NAME, {
        url: 'http://webhook.site/da9c3dba-881f-4f48-8229-bb0caf30c3d4',
        payload: event.args
      })
      .attempts(10)
      .backoff({ type:'exponential' })
      .save()
    }
  })

  //listen all event from contract from block 0 to the lastest block
  // instance.allEvents({
  //   fromBlock: 0,
  //   toBlock: 'latest'
  // }, (error, event) => {
  //   console.log("event received")
  //   if (error) {
  //     console.log(error)
  //   }
  //   else {
  //     console.log(event)
  //   }
  // })

})
.catch( error => {
  console.log("PUUUUTE")
  console.log(error)
  process.exit(0)
})


// API
