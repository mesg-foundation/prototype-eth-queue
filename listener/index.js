import Web3 from "web3"
import EventHandler from "./eventHandler"
import Events from "./events"

const web3 = new Web3(new Web3.providers.HttpProvider("http://parity:8545"))

const eventList = Events.map(({ abi, address, events }) => {
  const contract = web3.eth.contract(abi)
  const instance = contract.at(address)
  
  const eventsObjects = events.map(({ name, endpoint, secret }) => {
    const eventWatcher = instance[name]({}, { fromBlock: 'latest', toBlock: 'latest' })
    eventWatcher.watch((err, e) => {
      if (err) { return process.exit(0) }
      return EventHandler({
        ...e,
        meta: {
          address,
          name,
          endpoint,
          secret,
        }
      })
    })
    return eventWatcher
  })
  return {
    instance,
    events: eventsObjects
  }
})
