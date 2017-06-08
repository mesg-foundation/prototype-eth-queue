import { contract, execute } from '@/lib/eth-hook'

const hooksCount = (_, { creator }) => contract()
.then(instance => execute(instance, 'getEventListenersCount', {
  creator
}))

const fetchHook = ({ commit }, { creator, index }) => contract()
.then(instance => execute(instance, 'getEventListener', {
  _creator: creator,
  _index: index
}))
.then(hook => commit('UPDATE', { hook }))

const hooks = ({ commit, dispatch }, { creator }) => {
  dispatch('hooksCount', { creator })
  .then(({ output }) => [...new Array(output)]
    .map((_, i) => dispatch('fetchHook', {
      creator,
      index: i
    }))
  )
}

export default {
  hooksCount,
  fetchHook,
  hooks
}
