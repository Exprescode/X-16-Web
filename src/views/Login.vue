<template>
  <div id="form">
    <div id="title">X-16</div>
    <div id="subtitle">Fueled up and ready to fly!</div>
    <div v-bind:class="message_style" v-if="message">{{message}}</div>
    <div class="group">
      <div class="label">EMAIL</div>
      <input type="email" spellcheck="false" v-model="email">
    </div>
    <div class="group">
      <div class="label">PASSWORD</div>
      <input type="password" v-model="password">
    </div>
    <div class="group">
      <button v-on:click="authenticate">LOGIN</button>
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
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      message: "",
      message_style: ""
    };
  },
  methods: {
    authenticate() {
      axios
        .get("http://45.79.78.80/query", {
          params: {
            query:
              'query {GetUser(email:"' +
              this.email +
              '" password:"' +
              this.password +
              '")}'
          }
        })
        .then(response => {
          if (response.data.data.GetUser === "User retrieved.") {
            this.$router.replace("/chat");
          } else {
            this.setMessage("Invalid email or password!", "message negative");
          }
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.setMessage(
            "Something went wrong. Please try again later.",
            "message negative"
          );
        });
    },
    setMessage(msg, msg_style) {
      this.message = msg;
      this.message_style = msg_style;
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
