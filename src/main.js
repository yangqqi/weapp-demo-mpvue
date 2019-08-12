import Vue from 'vue'
import App from './App'

import './style/comm.less'
import './style/weui.wxss'

import store from './store.js'
import storage from './plugins/storage.js'
import fly from './plugins/fly.js'
import dayjs from 'dayjs'

Vue.prototype.$storage = storage
Vue.prototype.$store = store
Vue.prototype.$fly = fly
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
