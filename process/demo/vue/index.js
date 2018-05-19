// vue
import Vue from 'vue'
import App from './App.vue'
import './index.css'
Vue.config.debug = true;//开启错误提示
new Vue({
  el: '#root',
  template: '<App/>',
  components: { App }
})