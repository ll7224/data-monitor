import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./routers/router";
import store from "./store/store";
import "./assets/styles/reset.css";
import "./plugins/iview.js";
import "babel-polyfill";
import ConfirmModal from "./components/ConfirmModal/index";

Vue.use(ConfirmModal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
