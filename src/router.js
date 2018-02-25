// import Vue from 'vue'
import VueRouter from 'vue-router'
import FullExampleComponent from './components/Full'

// Vue.use(VueRouter)

const examples = [
  {
    path: '',
    component: FullExampleComponent
  },
  {
    path: 'full',
    component: FullExampleComponent
  }
]

const router = new VueRouter({
  examples
})
export default router
