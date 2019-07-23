<template>
  <div id="drawer">
    <button v-on:click="selectName" v-if="isGroupAdmin()">
      <img src="../assets/pencil.png">Change Name
    </button>
    <button v-on:click="selectAddMember" v-if="isGroupAdmin()">
      <img src="../assets/add_user.png">Add Member
    </button>
    <button v-on:click="selectRemoveMember" v-if="isGroupAdmin()">
      <img src="../assets/remove_user.png">Remove Member
    </button>
    <button v-on:click="selectAddAdmin" v-if="isGroupAdmin()">
      <img src="../assets/up_user.png">Add Admin
    </button>
    <button v-on:click="selectRemoveAdmin" v-if="isGroupAdmin()">
      <img src="../assets/down_user.png">Remove Admin
    </button>
    <button v-on:click="selectDelete" v-show="!isGroup() || isGroupAdmin()">
      <img src="../assets/bin.png">Delete Chat
    </button>
    <!-- <button v-on:click="selectLeave">
      <img src="../assets/bin.png">Leave Chat
    </button>-->
    <button v-on:click="selectClose">
      <img src="../assets/cross_2.png">Close
    </button>
  </div>
</template>

<script>
import { DELETE_CHAT } from "@/graphql";
export default {
  name: "ChatDrawerMenu",
  methods: {
    isGroup() {
      if (this.$parent.active_chat) {
        return this.$parent.active_chat.__typename == "GroupChat";
      }
      return false;
    },
    isGroupAdmin() {
      if (this.$parent.active_chat && this.isGroup()) {
        return (
          this.$parent.active_chat.admins.filter(
            x => x.email == this.$parent.master_email
          ).length > 0
        );
      }
      return false;
    },
    selectClose() {
      this.$parent.removeLeftPanelActiveComponent();
    },
    selectName() {
      this.$parent.addLeftPanelActiveComponent("ChatDrawerName");
    },
    selectAddMember() {
      this.$parent.addLeftPanelActiveComponent("ChatDrawerAddMember");
    },
    selectRemoveMember() {
      this.$parent.addLeftPanelActiveComponent("ChatDrawerRemoveMember");
    },
    selectAddAdmin() {
      this.$parent.addLeftPanelActiveComponent("ChatDrawerAddAdmin");
    },
    selectRemoveAdmin() {
      this.$parent.addLeftPanelActiveComponent("ChatDrawerRemoveAdmin");
    },
    selectDelete() {
      this.$apollo
        .mutate({
          mutation: DELETE_CHAT,
          variables: {
            id: this.$parent.active_chat.id,
            chatType: this.$parent.active_chat.__typename,
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
        });
    },
    selectLeave() {}
  }
};
</script>

<style scoped>
button {
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

button:hover {
  background-color: #f5faff;
}

img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
