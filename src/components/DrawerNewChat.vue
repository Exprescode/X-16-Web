<template>
  <div id="drawer">
    <div id="people_list">
      <PeopleListEntry v-for="user in users" v-bind:user="user" v-bind:key="user.id"/>
    </div>
    <div id="search">
      <div id="textbox">
        <input type="text" placeholder="Search" v-model="search" spellcheck="false">
        <button v-on:click="search = ''">
          <img src="../assets/cross.png" v-show="search">
        </button>
      </div>
    </div>
    <div id="name">
      <div>Chat Name</div>
      <input v-bind:disabled="selected_users.length <= 1" v-model="chat_name">
    </div>
    <div class="menu_option">
      <span id="count">{{selected_users.length}}</span> Selected
    </div>
    <div class="menu_option" v-show="error_msg">
      <span id="error">{{error_msg}}</span>
    </div>
    <button
      class="menu_option clickable"
      v-on:click="selectCreate"
      v-bind:disabled="selected_users.length < 1"
    >
      <img src="../assets/plus.png">Create
    </button>
    <button class="menu_option clickable" v-on:click="selectCancel">
      <img src="../assets/cross_2.png">Cancel
    </button>
  </div>
</template>

<script>
import _ from "lodash";
import PeopleListEntry from "@/components/PeopleListEntry.vue";
import { GET_USERS, CREATE_CHAT } from "@/graphql";
export default {
  name: "DrawerNewChat",
  components: {
    PeopleListEntry
  },
  created() {
    this.debouncedGetUsers = _.debounce(this.getUsers, 1000);
  },
  watch: {
    search: function() {
      this.debouncedGetUsers();
    },
    selected_users: function() {
      if (this.selected_users.length == 1) {
        this.chat_name = this.selected_users[0].name;
      } else if (
        this.selected_users.length == 0 ||
        this.chat_name == this.selected_users[0].name
      ) {
        this.chat_name = "";
      }
    }
  },
  data() {
    return {
      search: "",
      users: [],
      selected_users: [],
      selected_users_email: [],
      chat_name: "",
      error_msg: ""
    };
  },
  methods: {
    getUsers() {
      if (!this.search) {
        this.users = this.selected_users;
        return;
      }
      this.$apollo
        .query({
          query: GET_USERS,
          variables: {
            email: this.search,
            token: this.$parent.session_token
          }
        })
        .then(data => {
          this.users = data.data.GetUsers.filter(
            x => x.email != this.$parent.master_email
          );
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
          var gqlError = error.graphQLErrors;
          if (gqlError.length > 0) {
            if (gqlError[0].message.includes("Invalid token.")) {
              this.logoutUser();
            }
          }
        });
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
    selectCreate() {
      /* eslint-disable */
      this.error_msg = "";
      var name =
        this.selected_users.length > 1
          ? this.chat_name
            ? this.chat_name
            : "New Group"
          : "";
      this.$apollo
        .mutate({
          mutation: CREATE_CHAT,
          variables: {
            creator: this.$parent.master_email,
            receipient: this.selected_users_email,
            name: name,
            token: this.$parent.session_token
          }
        })
        .then(data => {
          if (data.data.CreateChat == "Chat Created") {
            this.$parent.resetLeftPanelActiveComponent();
          }
        })
        .catch(error => {
          var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Invalid token.")) {
                this.$parent.expireSession();
              }
            }

          this.error_msg = "Create Chat Error! Try Again Later.";
        });
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
