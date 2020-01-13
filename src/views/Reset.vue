<template>
  <div id="form">
    <div id="title">
      <router-link to="/" replace>
        <a>X-16</a>
      </router-link>
    </div>
    <div id="subtitle">Don't panic! Stay calm.</div>
    <div class="error" v-if="connection_error">Something went wrong. Please try again later.</div>
    <div class="error" v-if="captcha_error">Captcha failed. Please try again.</div>
    <div class="error" v-if="email_error">
      Email does not exist!
      <router-link to="/register">
        <a>Create Account</a>
      </router-link>
    </div>
    <div class="group">
      <div class="label">EMAIL</div>
      <input type="email" spellcheck="false" v-model="email" v-on:keyup.enter="reset">
    </div>
    <div class="group">
      <button v-on:click="reset">RESET</button>
    </div>
  </div>
</template>

<script>
import { CHECK_USER_EXISTS_QUERY } from "@/graphql";

export default {
  name: "Reset",
  data() {
    return {
      email: "",
      email_error: false,
      connection_error: false,
      captcha_error: false
    };
  },
   methods: {
    reset() {
                  /* eslint-disable */
      this.$recaptcha('reset').then((token) => {
        const email = this.email;
        if (email === "") {
          this.setMessage("Please type in an email", "message negative");
          return;
        }
        this.$apollo
          .query({
            query: CHECK_USER_EXISTS_QUERY,
            variables: {
              email: email,
              token: token
            }
          })
          .then(data => {
            window.sessionStorage.setItem("reset_email", this.email);

            this.$router.replace({
              name: "ResetPassword",
              params: {
                message: "Please check your email for the verification code!",
                message_style: "message positive"
              }
            });
          })
          .catch(error => {
             var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              console.log(gqlError[0].message)
              if (gqlError[0].message.includes("Captcha failed")) {
                 this.captcha_error = true
              } else if (gqlError[0].message.includes("query returned no result")) {
                this.email_error = true
              }  
            } else {
              this.connection_error = true
            } 
        });
      })
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
