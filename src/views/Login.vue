<template>
  <div id="form">
    <div id="title">X-16</div>
    <div id="subtitle">Fueled up and ready to fly!</div>
    <div v-bind:class="active_message_style" v-if="active_message">{{active_message}}</div>
    <div class="group">
      <div class="label" autocomplete>EMAIL</div>
      <input
        type="email"
        spellcheck="false"
        v-on:keyup.enter="getUser"
        v-model="email"
        autocomplete="email"
        required
      >
    </div>
    <div class="group">
      <div class="label">PASSWORD</div>
      <input
        type="password"
        v-on:keyup.enter="getUser"
        v-model="password"
        autocomplete="password"
        required
      >
    </div>
    <div class="group">
      <button v-on:click="getUser">LOGIN</button>
      <div id="links">
        <div>
          Need an account?
          <router-link to="/register">
            <a>Register</a>
          </router-link>
        </div>
        <div>
          Forget Password?
          <router-link to="/reset">
            <a>Reset</a>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_USER } from "@/graphql";

export default {
  name: "Login",
  props: ["message", "message_style"],
  created() {
    if (
      window.sessionStorage.getItem("master_email") &&
      window.sessionStorage.getItem("jwtToken")
    ) {
      if (document.getElementsByClassName("grecaptcha-badge").length > 0) {
        document.getElementsByClassName(
          "grecaptcha-badge"
        )[0].style.visibility = "collapse";
      }
      this.$router.replace("/chat");
    }
  },
  data() {
    return {
      email: "",
      password: "",
      active_message: this.message,
      active_message_style: this.message_style
    };
  },
  methods: {
    getUser() {
      var token = ""
      // this.$recaptcha('login').then((token) => {
      const email = this.email;
      const password = this.password;
      if (email === "" || password === "") {
        this.setMessage("Invalid email or password!", "message negative");
        return;
      }
        this.$apollo
          .query({
            query: GET_USER,
            variables: {
              email: email,
              password: password,
              token: "" // TODO: Token variable goes here.
            }
          })
          .then(data => {
            // eslint-disable-next-line
            console.log(data);
            this.$router.replace("/chat");
            document.getElementsByClassName(
              "grecaptcha-badge"
            )[0].style.visibility = "collapse";
            window.sessionStorage.setItem("master_email", this.email);
            window.sessionStorage.setItem("jwtToken", data.data.GetUser);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Captcha failed")) {
                this.setMessage("Captcha failed", "message negative");
              } else if (gqlError[0].message.includes("User not verified")) {
                this.$router.replace("/verify");
                window.sessionStorage.setItem("verify_email", this.email);
              } else {
                this.setMessage(
                  "Invalid email or password!",
                  "message negative"
                );
              }
            } else {
              this.setMessage("An error occured", "message negative");
            }
            this.password = "";
        });
      // })
    }
   ,
    setMessage(message, message_style) {
      this.active_message = message;
      this.active_message_style = message_style;
    }
  }
};
</script>

<style scoped>
#form {
  background-color: white;
  width: 400px;
  height: auto;
  display: block;
  margin: 0;
  box-sizing: border-box;
  padding: 24px;
  border-radius: 8px;
  box-shadow: -5px -5px 10px #00000019;
}

#form #title {
  text-align: center;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 40px;
  color: #327ad1;
  font-family: "Roboto Black", sans-serif;
}

#form #title a {
  text-decoration: none;
  color: #327ad1;
}

#form #subtitle {
  text-align: center;
  margin: 0;
  padding: 0;
  font-size: 20px;
  color: #82bbff;
  font-family: "Roboto Light", sans-serif;
}

#form #error {
  font-family: "Roboto Medium", sans-serif;
  color: red;
}

#form #success {
  font-family: "Roboto Medium", sans-serif;
  color: #a4de02;
}

#form .group {
  margin: 16px 0 0 0;
}

#form .label {
  color: #3c95ff;
  padding: 0 0 0 8px;
  margin: 0 0 8px 0;
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
}

#form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  font-size: 20px;
  color: #327ad1;
  border-radius: 8px;
  border-style: none;
  background-color: #dbebff;
  font-family: "Roboto Light", sans-serif;
}

#form button {
  width: 100%;
  padding: 8px 0 8px 0;
  border-radius: 40px;
  border-style: none;
  background-color: #3c95ff;
  color: white;
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
}

#form #links {
  padding: 8px 0 0 0;
  font-family: "Roboto Light", sans-serif;
}

#form #links a {
  font-family: "Roboto Medium", sans-serif;
  text-decoration: none;
  color: #82bbff;
}

#form #links a:hover {
  text-decoration: underline;
}

#form #links a:visited {
  color: #82bbff;
}

#form .message {
  margin: 0 0 0 8px;
  padding: 0;
  text-align: center;
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
}

#form .positive {
  color: lime;
}

#form .negative {
  color: red;
}
</style>
