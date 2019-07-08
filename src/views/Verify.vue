<template>
  <form id="form">
    <div id="title">X-16</div>
    <div id="subtitle">Fueled up and ready to fly!</div>
    <div v-bind:class="active_message_style" v-if="active_message">{{active_message}}</div>
    <div class="group">
      <div class="label" autocomplete>Verification Code</div>
      <input
        v-on:keyup.enter="verifyCode"
        v-model="code"
        required
      >
    </div>
  
    <div class="group">
      <button v-on:click="verifyCode">VERIFY</button>
    </div>
  </form>
</template>

<script>
import { SEND_CODE_MUTATION } from "@/graphql";

export default {
  name: "Login",
  props: ["message", "message_style"],
  data() {
    return {
      email: window.sessionStorage.getItem("verify_email"),
      code: "",
      active_message: this.message,
      active_message_style: this.message_style
    };
  },
  methods: {
    verifyCode() {
      this.$recaptcha('verify').then((token) => {
        const email = this.email;
        const code = this.code;
        if (code === "" ||  email == "") {
          this.setMessage("Invalid code", "message negative");
          return;
        }
        this.$apollo
          .mutate({
            mutation: SEND_CODE_MUTATION,
            variables: {
              email: email,
              code: code,
              token: token
            }
          })
          .then(data => {
            if (data.data.VerifyCode == "User verified") {
              this.$router.replace({
                name: "Login",
                params: {
                  message: "User verified!",
                  message_style: "message positive"
                }
            });
              window.sessionStorage.removeItem("verify_email");
            }
          })
          .catch(error => {
            var gqlError = error.graphQLErrors[0].message

            if (gqlError.includes("Captcha failed")) {
                this.setMessage("Captcha failed", "message negative");
            } else if (gqlError.includes("Token is invalid")) {
              this.setMessage("Your token is invalid.", "message negative");
              
            }else {
              this.setMessage("An error occured", "message negative");
            }  
        });
      })
    }
   ,
    setMessage(message, message_style) {
      this.active_message = message;
      this.active_message_style = message_style;
    },
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
