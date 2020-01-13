<template>
  <div id="form">
    <div id="title">
      <router-link to="/" replace>
        <a>X-16</a>
      </router-link>
    </div>
    <div id="subtitle">A new experience awaits!</div>
    <div class="error" v-if="connection_error">Oops! Something went wrong. Please try again later.</div>
    <div class="error" v-if="captcha_error">Captcha failed. Please try again.</div>
    <div class="error" v-if="password_error">Passwords do not match!</div>
    <div class="error" v-if="email_error">
      Email already exist!
      <router-link to="/reset" replace>
        <a>Reset Password</a>
      </router-link>
    </div>
    <div class="group">
      <div class="label">USERNAME</div>
      <input type="text" spellcheck="false" v-model="name" required>
    </div>
    <div class="group">
      <div class="label">EMAIL</div>
      <input type="email" spellcheck="false" v-model="email" autocomplete="email" required>
    </div>
    <div class="group">
      <div class="label">PASSWORD</div>
      <input type="password" v-model="password" required>
    </div>
    <div class="group">
      <div class="label">CONFIRM PASSWORD</div>
      <input type="password" v-model="repassword" v-on:keyup.enter="addUser" required>
    </div>
    <div class="group">
      <button v-on:click="addUser">REGISTER</button>
    </div>
  </div>
</template>

<script>
import { ADD_USER } from "@/graphql";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      name: "",
      password: "",
      repassword: "",
      email_error: false,
      connection_error: false,
      password_error: false,
      captcha_error: false
    };
  },
  methods: {
    clearError() {
      this.email_error = false;
      this.connection_error = false;
      this.password_error = false;
      this.captcha_error = false;
    },
    addUser() {
      /* eslint-disable */
      this.$recaptcha('register').then((token) => {
        this.clearError();
        if (this.password != this.repassword) {
          this.password_error = true;
          return;
        }
        this.email_error = false;
        this.connection_error = false;
        const email = this.email;
        const name = this.name;
        const password = this.password;
        this.$apollo
          .mutate({
            mutation: ADD_USER,
            variables: {
              email: email,
              name: name,
              password: password,
              token: token
            }
          })
          
          .then(data => {
            window.sessionStorage.setItem("verify_email", this.email);
  
            this.$router.replace({
              name: "Verify",
              params: {
                message: "Please check your email for the verification code!",
                message_style: "message positive"
              }
            });
          })
          .catch(error => {
            var gqlError = error.graphQLErrors;
  
            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Captcha failed")) {
                this.captcha_error = true;
              } else if (
                gqlError[0].message.includes(
                  "A unique constraint would be violated on User"
                )
              ) {
                this.email_error = true;
              }
            } else {
              this.connection_error = true;
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
