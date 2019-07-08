import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Reset from "./views/Reset.vue";
import Chat from "./views/Chat.vue";
import Verify from "./views/Verify.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      props: true
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/reset",
      name: "Reset",
      component: Reset
    },
    {
      path: "/chat",
      name: "Chat",
      component: Chat
    },
    {
      path: "/verify",
      name: "Verify",
      component: Verify
    },
  ]
});
