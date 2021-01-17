import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import "./assets/css/tailwind.css"

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyCESZ2jnCCryFTUGR3quVBYYDYDDr7PDb8",
  authDomain: "vue-community-app.firebaseapp.com",
  databaseURL: "https://vue-community-app-default-rtdb.firebaseio.com",
  projectId: "vue-community-app",
  storageBucket: "vue-community-app.appspot.com",
  messagingSenderId: "841253033717",
  appId: "1:841253033717:web:390ef0cb794e068d8b17bc",
  measurementId: "G-05Y7QCPTNS"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
