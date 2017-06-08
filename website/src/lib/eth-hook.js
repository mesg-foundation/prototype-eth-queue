import Web3 from 'web3'

const ARRAY_STR = '[]'

const EthHookData = {
  provider: null,
  web3: null,
  contract: null
}

let log = (message) => {}
if (process.env.NODE_ENV !== 'production') {
  window.ETH_HOOK = EthHookData
  log = console.debug
}

const transform = (value, type, recursiveFunction, binding) => {
  if (type.substr(-ARRAY_STR.length) === ARRAY_STR) {
    return value.split(',').map(e => recursiveFunction(e, type.substr(0, type.length - ARRAY_STR.length)))
  }
  return (binding[type] || ((value) => value))(value)
}

const transformInput = (value, type) => transform(value, type, transformInput, {
  bytes32: value => EthHookData.web3.fromAscii(value),
  uint256: value => value,
  address: value => value.toLowerCase(),
  bool: value => value
})

const transformOutput = (value, type) => transform(value, type, transformOutput, {
  bytes32: value => EthHookData.web3.toAscii(value),
  uint256: value => value.toNumber(),
  address: value => value.toLowerCase(),
  bool: value => value
})

const transformInputs = (inputs, payload) => inputs.map(e => transformInput(payload[e.name], e.type))

const transformOutputs = (outputs, result) => outputs.map((e, i) => ({
  name: e.name || 'output',
  value: transformOutput(outputs.length > 1 ? result[i] : result, e.type)
})).reduce((result, item) => {
  result[item.name] = item.value
  return result
}, {})

const contract = async (options = {
  endpoint: process.env.PROVIDER_ENDPOINT,
  abi: process.env.CONTRACT_ABI,
  address: process.env.CONTRACT_ADDRESS
}) => {
  EthHookData.provider = ((provider) => {
    if (provider) { return provider }
    if (typeof web3 === 'undefined') {
      return new Web3.providers.HttpProvider(options.endpoint)
    } else {
      return web3.currentProvider
    }
  })(EthHookData.provider)

  EthHookData.web3 = EthHookData.web3 || new Web3(EthHookData.provider)

  EthHookData.contract = EthHookData.contract || EthHookData.web3.eth
  .contract(options.abi)
  .at(options.address)

  return EthHookData.contract
}

const execute = (contractInstance, functionName, payload) => new Promise((resolve, reject) => {
  const { inputs, outputs, name } = contractInstance.abi
  .filter(e => e.type === 'function' && e.name === functionName)[0]

  const contractArguments = transformInputs(inputs, payload)
  log(`call ${functionName} with `, payload)
  contractInstance[name](...contractArguments, (error, result) => {
    if (error) {
      log(`error for ${functionName}`, error)
      reject(error)
    } else {
      log(`result of ${functionName}`, result)
      resolve(transformOutputs(outputs, result))
    }
  })
})

export {
  contract,
  execute
}
