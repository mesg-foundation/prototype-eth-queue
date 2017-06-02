const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider("http://localhost:8545")
const contract = require("truffle-contract")
const abi = require("./erc20-abi.json")
const contractAddress = "0x48c80F1f4D53D5951e5D5438B54Cba84f29F32a5"

const MyContract = contract({
  abi: abi,
})
MyContract.setProvider(provider)

MyContract.at(contractAddress)
.then( instance => {
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
  console.log(error)
})


// API
