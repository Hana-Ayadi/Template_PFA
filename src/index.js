import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import slider from './components/slider.vue'
import toast from './components/toast.vue'
import uploader from './components/uploader.vue'
import popbox from './components/popbox.vue'
import icon from './components/icon.vue'
import './app.scss'
import router from './router.js'
import Vuetify from 'vuetify'

const VueUploadComponent = require('vue-upload-component')
// const VuePageDesigner = require('vue-page-designer')
Vue.component('slider', slider)
Vue.component('toast', toast)
Vue.component('uploader', uploader)
Vue.component('popbox', popbox)
Vue.component('icon', icon)
Vue.component('file-upload', VueUploadComponent)
// Vue.component('VuePageDesigner', VuePageDesigner)
Vue.use(VueRouter)
Vue.use(Vuetify)
new Vue({
  el: '#app',
  render: h => h(App),
  router
}).$mount('#app')
