import Vue from 'vue'
import Vuex from 'vuex'
import ethereum from './modules/ethereum'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ethereum
  },
  strict: process.env.NODE_ENV !== 'production'
})
