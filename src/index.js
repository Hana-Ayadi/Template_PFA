import Vue from 'vue'
import App from './App.vue'

import slider from './components/slider.vue'
import toast from './components/toast.vue'
import uploader from './components/uploader.vue'
import popbox from './components/popbox.vue'
import icon from './components/icon.vue'

import './app.scss'

const VueUploadComponent = require('vue-upload-component')

// 全局注册组件
Vue.component('slider', slider)
Vue.component('toast', toast)
Vue.component('uploader', uploader)
Vue.component('popbox', popbox)
Vue.component('icon', icon)

Vue.component('file-upload', VueUploadComponent)

export default App
