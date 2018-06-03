import VueRouter from 'vue-router'
// import FullExampleComponent from './components/Full'
import upload from './components/upload'
import slider from './components/design'
import example from './components/panel/ex'

let examples = [
  {
    path: '/',
    component: upload
  },
  {
    path: '/slider',
    component: slider
  },
  {
    path: '/full',
    name: 'design',
    component: slider
  },
  {
    path: '/upload',
    component: upload
  },
  {
    path: '/example',
    component: example
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes: examples
})
export default router
