<template>
  <div id="drawer">
    <div id="text_field">
      <div>Chat Name</div>
      <input type="text" v-model="chat_name">
      <div v-show="error_msg">
        <span>{{error_msg}}</span>
      </div>
    </div>
    <button class="button_field" v-on:click="selectDone">
      <img src="../assets/tick.png">Done
    </button>
    <button class="button_field" v-on:click="selectCancel">
      <img src="../assets/cross_2.png">Cancel
    </button>
  </div>
</template>

<script>
import { CHANGE_GROUP_NAME } from "@/graphql";
export default {
  name: "DrawerAccount",
  data() {
    return {
      chat_name: this.$parent.active_chat.name,
      error_msg: ""
    };
  },
  methods: {
    selectDone() {
      this.error_msg = "";
      if (!this.chat_name) {
        this.error_msg = "Name is empty!";
        return;
      }
      this.$apollo
        .mutate({
          mutation: CHANGE_GROUP_NAME,
          variables: {
            id: this.$parent.active_chat.id,
            name: this.chat_name,
            token: this.$parent.session_token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data);
          this.$parent.resetLeftPanelActiveComponent();
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.error_msg = "Invalid old password!";
        });
    },
    selectCancel() {
      this.$parent.removeLeftPanelActiveComponent();
    }
  }
};
</script>

<style scoped>
#drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

#profile {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#profile div {
  padding: 0;
  margin: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-family: "Roboto Medium", sans-serif;
  font-size: 24px;
}

#profile span {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 0 0 16px;
}

#profile button {
  margin: 0 0 0 16px;
  padding: 0 8px 0 8px;
  height: 2em;
  border-radius: 1em;
  box-sizing: border-box;
  border-style: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  background-color: #3c95ff;
}

#profile button:hover {
  background-color: #3c95ffe5;
}

#text_field {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#text_field div {
  color: #404040;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  padding: 0 0 0 6px;
  margin: 0 0 4px 0;
}

#text_field input {
  margin: 0 0 8px 0;
  padding: 6px 8px 6px 8px;
  border-style: none;
  border-radius: 8px;
  color: #404040;
  font-family: "Roboto Light", sans-serif;
  font-size: 16px;
  background-color: #f0f7ff;
  width: 100%;
  box-sizing: border-box;
}

#text_field span {
  color: red;
}

.button_field {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  border-style: none;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 16px;
}

.button_field:hover {
  background-color: #f5faff;
}

.button_field img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

.profile_violet {
  background-color: #9400d3;
}

.profile_indigo {
  background-color: #4b0082;
}

.profile_blue {
  background-color: #0000ff;
}

.profile_green {
  background-color: #00ff00;
}

.profile_orange {
  background-color: #ff7f00;
}

.profile_red {
  background-color: #ff0000;
}
</style>
