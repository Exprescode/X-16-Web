<template>
  <div id="drawer">
    <div id="people_list">
      <PeopleListEntry v-for="user in users" v-bind:user="user" v-bind:key="user.id"/>
    </div>
    <div class="menu_option">
      <span id="count">{{selected_users.length}}</span> Selected
    </div>
    <div class="menu_option" v-show="error_msg">
      <span id="error">{{error_msg}}</span>
    </div>
    <button
      class="menu_option clickable"
      v-on:click="selectDone"
      v-bind:disabled="selected_users.length < 1"
    >
      <img src="../assets/tick.png">Done
    </button>
    <button class="menu_option clickable" v-on:click="selectCancel">
      <img src="../assets/cross_2.png">Cancel
    </button>
  </div>
</template>

<script>
import PeopleListEntry from "@/components/PeopleListEntry.vue";
import { KICK_GROUP_ADMIN, KICK_GROUP_MEMBER } from "@/graphql";
export default {
  name: "ChatDrawerRemoveMember",
  components: {
    PeopleListEntry
  },
  data() {
    return {
      users: this.initUsers(),
      error_msg: "",
      selected_users: [],
      selected_users_email: [],
      pass_count: 0
    };
  },
  methods: {
    initUsers() {
      if (
        !this.$parent.active_chat ||
        this.$parent.active_chat.__typename != "GroupChat"
      ) {
        return [];
      }
      return [
        ...this.$parent.active_chat.admins.filter(
          x => x.email != this.$parent.master_email
        ),
        ...this.$parent.active_chat.members
      ];
    },
    indexOfSelectedUser(user) {
      return this.selected_users_email.indexOf(user.email);
    },
    selectUser(user) {
      this.selected_users.push(user);
      this.selected_users_email.push(user.email);
    },
    deselectUser(user) {
      var i = this.indexOfSelectedUser(user);
      if (i >= 0) {
        this.selected_users.splice(i, 1);
        this.selected_users_email.splice(i, 1);
      }
    },
    selectDone() {
      this.error_msg = "";
      var admins_email = [];
      for (var i = 0; i < this.$parent.active_chat.admins.length; ++i) {
        admins_email.push(this.$parent.active_chat.admins[i].email);
      }
      var members_email = [];
      for (i = 0; i < this.$parent.active_chat.members.length; ++i) {
        members_email.push(this.$parent.active_chat.members[i].email);
      }
      var selected_users_email = [];
      for (i = 0; i < this.selected_users.length; ++i) {
        selected_users_email.push(this.selected_users[i].email);
      }
      var rm_admins = selected_users_email.filter(x =>
        admins_email.includes(x)
      );
      var rm_members = selected_users_email.filter(x =>
        members_email.includes(x)
      );
      this.$apollo
        .mutate({
          mutation: KICK_GROUP_ADMIN,
          variables: {
            id: this.$parent.active_chat.id,
            members: rm_admins,
            token: this.$parent.session_token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data);
          this.twoPassActive(true);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.error_msg = "Kick Admin Error! Try Again Later.";
        });
      this.$apollo
        .mutate({
          mutation: KICK_GROUP_MEMBER,
          variables: {
            id: this.$parent.active_chat.id,
            members: rm_members,
            token: this.$parent.session_token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data);
          this.twoPassActive(true);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          this.error_msg = "Kick Member Error! Try Again Later.";
        });
    },
    twoPassActive(pass) {
      if (pass) {
        if (++this.pass_count == 2) {
          this.pass_count = 0;
          this.$parent.resetLeftPanelActiveComponent();
        }
      } else {
        this.pass_count = 0;
      }
    },
    selectCancel() {
      this.$parent.removeLeftPanelActiveComponent();
    }
  }
};
</script>

<style scoped>
button,
input {
  border-style: none;
  background-color: transparent;
}

#drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

#people_list {
  flex: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-y: auto;
}

.clickable:hover {
  background-color: #f5faff;
}

.menu_option {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 16px;
  flex: none;
}

.menu_option img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

.menu_option #count {
  font-family: "Roboto Medium", sans-serif;
  color: #3c95ff;
  font-size: 24px;
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  text-align: center;
}

.menu_option #error {
  color: red;
}

#search {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  flex: none;
}

#textbox {
  width: 100%;
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}

#textbox input {
  width: 100%;
  padding: 0;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 16px;
}

#textbox button {
  margin: 0 0 0 8px;
  padding: 0;
  height: 12px;
  width: 12px;
}

#textbox button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#name {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#name div {
  color: #404040;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  padding: 0 0 0 6px;
  margin: 0 0 4px 0;
}

#name input {
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
</style>
