// import Vue from 'vue'
import VueRouter from 'vue-router'
import FullExampleComponent from './components/Full'

// Vue.use(VueRouter)

let examples = [
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
  routes: [
        {examples}
  ]
})
export default router
