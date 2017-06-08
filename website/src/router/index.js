import Vue from 'vue'
import Router from 'vue-router'
import Hooks from '@/components/Hooks'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'Hooks', component: Hooks }
  ]
})
