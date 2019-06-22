<template>
  <div id="form">
    <div id="title">
      <router-link to="/" replace>
        <a>X-16</a>
      </router-link>
    </div>
    <div id="subtitle">Don't panic! Stay calm.</div>
    <div class="error" v-if="connection_error">Something went wrong. Please try again later.</div>
    <div class="error" v-if="email_error">
      Email does not exist!
      <router-link to="/register">
        <a>Create Account</a>
      </router-link>
    </div>
    <div class="group">
      <div class="label">EMAIL</div>
      <input type="email" spellcheck="false" v-model="email">
    </div>
    <div class="group">
      <button v-on:click="reset">RESET</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Reset",
  data() {
    return {
      email: "",
      email_error: false,
      connection_error: false
    };
  },
  methods: {
    reset() {
      this.email_error = false;
      this.connection_error = false;
      axios
        .get("http://45.79.78.80/query", {
          params: {
            query: "" //TODO check for email.
          }
        })
        .then(response => {
          if (response.data.data.GetUser === "") {
            //TODO if email exist
            this.$router.replace("/chat");
          } else {
            this.email_error = true;
          }
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.connection_error = true;
        });
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

#form .error {
  margin: 0 0 0 8px;
  padding: 0;
  color: red;
  text-align: center;
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
}

#form .error a {
  text-decoration: none;
  color: #3c95ff;
}

#form .error a:hover {
  text-decoration: underline;
}
</style>
