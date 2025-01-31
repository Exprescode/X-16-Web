import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Reset from "./views/Reset.vue";
// import Chat from "./views/Chat.vue";
import Verify from "./views/Verify.vue";
import ResetPassword from "./views/ResetPassword.vue";
import Main from "./views/Main.vue";

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
    // {
    //   path: "/chat",
    //   name: "Chat",
    //   component: Chat
    // },
    {
      path: "/app",
      name: "Main",
      component: Main
    },
    {
      path: "/verify",
      name: "Verify",
      component: Verify
    },
    {
      path: "/resetpassword",
      name: "ResetPassword",
      component: ResetPassword
    }
  ]
});
