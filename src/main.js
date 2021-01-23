import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import axios from 'axios'
import VueAxios from "vue-axios";
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Vuelidate from 'vuelidate';
import { store } from './store/store'

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(Buefy);
Vue.use(Vuelidate);

// Components used for routing
import router from './router'

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
  store
})
