import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msg'
import './config/axios'
import './config/mq'


import store from './config/store'
import router from './config/router'


Vue.config.productionTip = false

new Vue({
  store, // store pode ser compartilhada entre componentes
  router, // router pode ser compartilhada entre componentes
  render: h => h(App)
}).$mount('#app')