<template>
  <div id="container">
    <div id="left_panel">
      <div id="chat_list">
        <ChatListEntry v-for="chat in chats" v-bind:chat="chat" v-bind:key="chat.id"/>
      </div>
      <div id="toolbar">
        <button class="menu" v-on:click="setDrawerState('lobby')">
          <img src="../assets/menu.png" />
        </button>
        <div class="search">
          <input type="text" placeholder="Search" v-model="search_chat_list" />
          <button v-show="search_chat_list" v-on:click="clearSearchChatList">
            <img src="../assets/cross.png" />
          </button>
        </div>
      </div>
      <div id="drawer" v-show="drawer_state === 'lobby'">
        <button v-on:click="setDrawerState('')">
          <img src="../assets/cross_2.png" />Close
        </button>
        <button v-on:click="logoutUser">
          <img src="../assets/door.png" />Logout
        </button>
        <button>
          <img src="../assets/gear.png" />Settings
        </button>
        <button v-on:click="setDrawerState('add-chat')">
          <img src="../assets/plus.png" />New Chat
        </button>
      </div>
      <div id="drawer_new_chat" v-show="drawer_state === 'add-chat'">
        <div id="people_list">
          <PeopleListEntry v-for="user in users" v-bind:user="user" v-bind:key="user.id" />
        </div>
        <div id="search">
          <input type="text" placeholder="Search" v-model="search_users" spellcheck="false">
          <button v-on:click="search_users = ''">
            <img src="../assets/cross.png" v-show="search_users&&!$apollo.loading">
          </button>
          <div v-show="$apollo.loading" class="loader"></div>
        </div>
        <div id="counter">
          <span>{{selected_users.length}}</span> Selected
        </div>
        <button v-on:click="createChat" v-bind:disabled="selected_users.length < 1">
          <img src="../assets/plus.png" />Create
        </button>
        <button v-on:click="cancelCreateChat">
          <img src="../assets/cross_2.png" />Cancel
        </button>
      </div>
    </div>
    <div id="right_panel">
      <div id="chat" v-if="active_chat">
        <div id="header">{{active_chat.name}}</div>
        <div id="converse">
          <ChatEntry
            v-for="entry in active_chat.messages"
            v-bind:converse="entry"
            v-bind:key="entry.id"
          />
        </div>
        <div id="compose">
          <div id="textbox">
            <input
              type="text"
              placeholder="Compose message here."
              v-model="message"
              v-on:keyup.enter="sendMessage"
              spellcheck="false"
            />
            <button v-show="search_chat && message" v-on:click="clearSearchChat">
              <img src="../assets/cross.png" />
            </button>
          </div>
          <button id="search">
            <img src="../assets/magnifying_glass.png" />
          </button>
          <button v-on:click="sendMessage" id="send">SEND</button>
            <!--<input type="file" v-on:change="uploadFile" ref="fileToUpload">-->
          <!--<vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>-->

        </div>
      </div>
      <div id="placeholder" v-else>Please select a chat.</div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import ChatEntry from "@/components/ChatEntry.vue";
import ChatListEntry from "@/components/ChatListEntry.vue";
import PeopleListEntry from "@/components/PeopleListEntry.vue";
import {
  GET_INDIVIDUAL_CHATS,
  INDIVIDUAL_CHAT_SUB,
  GET_USERS,
  CREATE_CHAT,
  SEND_MESSAGE,
  REFRESH_TOKEN_MUTATION,
  UPLOAD_FILE_MUTATION
} from "@/graphql";
export default {
  name: "Chat",
  components: {
    ChatEntry,
    ChatListEntry,
    PeopleListEntry
  },
  created() {
              // eslint-disable-next-line
    console.log("Created chat")
    if (
      !window.sessionStorage.getItem("master_email") ||
      !window.sessionStorage.getItem("jwtToken")
    ) {
      this.logoutUser()
      // this.$router.replace({
      //   name: "Login"
      // });
    }
    
    window.addEventListener('load', function () {
       document.getElementsByClassName('grecaptcha-badge')[0].style.visibility = "collapse"
    })
    this.oneRefreshToken()
    this.refreshToken()
    this.debouncedGetUsers = _.debounce(this.getUsers, 1000);
  },
  computed: {
    chats: function() {
      return this.GetIndividualChats;
    }
  },
  watch: {
    search_users: function() {
      this.debouncedGetUsers();
      // if (this.search_users.match(/^.+@.+\.+$/)) {
      // }
    }
  },
  data() {
    return {
      master: window.sessionStorage.getItem("master_email"),
      token: window.sessionStorage.getItem("jwtToken"),
      newToken: "",
      users: [],
      GetIndividualChats: "",
      message: "",
      active_chat: null,
      drawer_state: "",
      search_users: "",
      selected_users: [],
      search_chat_list: "",
      search_chat: false,
      refreshing: null,
      fileToUpload: []
    };
  },
  apollo: {
    GetIndividualChats: {
      query: GET_INDIVIDUAL_CHATS,
      variables() {
        return {
          email: this.master,
          token: this.token
        };
      },
      subscribeToMore: {
        document: INDIVIDUAL_CHAT_SUB,
        variables() {
          return {
            email: this.master
          };
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            GetIndividualChats: [
              subscriptionData.data.IndividualChatCreated,
              ...previousResult.GetIndividualChats
            ]
          };
        }
      }
    }
  },

  methods: {
    oneRefreshToken() {
       this.$apollo
          .mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
              email: this.master,
              token: this.token
            }
          })
          .then(data => {
            // eslint-disable-next-line
            window.sessionStorage.setItem("jwtToken", data.data.RefreshToken)
          })
          .catch(error => {
            var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Invalid token.")) {
                this.logoutUser();
              }
            }
          });
    },
    refreshToken() {
      this.refreshing = setInterval(() => {
        // eslint-disable-next-line
        this.$apollo
          .mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
              email: this.master,
              token: this.token
            }
          })
          .then(data => {
            // eslint-disable-next-line
            window.sessionStorage.setItem("jwtToken", data.data.RefreshToken)
          })
          .catch(error => {
            var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Invalid token.")) {
                this.logoutUser();
              }
            }
          });
      }, 480000);
    },
    sortGetIndividualChats() {
      this.GetIndividualChats.sort(function(a, b) {
        var a_is_new_chat = a.messages.length < 1;
        var b_is_new_chat = a.messages.length < 1;
        if (a_is_new_chat && !b_is_new_chat) {
          return true;
        } else if (!a_is_new_chat && b_is_new_chat) {
          return false;
        } else if (a_is_new_chat && b_is_new_chat) {
          var a_name = "";
          var b_name = "";
          for (var i = 0; i < a.members.length; i++) {
            if (a.members[i].email != this.master) {
              a_name = a.members[i].name;
              break;
            }
          }
          for (i = 0; i < b.members.length; i++) {
            if (b.members[i].email != this.master) {
              b_name = b.members[i].name;
              break;
            }
          }
          return a_name < b_name;
        }
        var date_a = new Date(
          a.messages[a.messages.length - 1].datetime
        ).getTime();
        var date_b = new Date(
          b.messages[b.messages.length - 1].datetime
        ).getTime();
        return date_a < date_b;
      });
    },
    setActiveChat(chat) {
      this.active_chat = chat;
      this.setScrollPosition();
    },
    setDrawerState(state) {
      this.drawer_state = state;
    },
    logoutUser() {
      document.getElementsByClassName('grecaptcha-badge')[0].style.visibility = "visible"
      window.sessionStorage.removeItem("master_email");
      window.sessionStorage.removeItem("jwtToken");
      this.$router.replace("/");
    },
    getUsers() {
      if (!this.search_users) {
        this.users = this.selected_users;
        return;
      }
      this.$apollo
        .query({
          query: GET_USERS,
          variables: {
            email: this.search_users,
            token: this.token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          // console.log(data);
          this.users = data.data.GetUsers;
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
    isSelectedUser(user) {
      return this.selected_users.indexOf(user) > -1;
    },
    addUser(user) {
      this.selected_users.push(user);
    },
    removeUser(user) {
      var i = this.selected_users.indexOf(user);
      if (i > -1) {
        this.selected_users.splice(i, 1);
      }
    },
    clearUsers() {
      this.selected_users = [];
      this.search_users = "";
      this.users = [];
    },
    cancelCreateChat() {
      this.clearUsers();
      this.drawer_state = "lobby";
    },
    createChat() {
      var chat_name = "";
      var receipient = [];
      for (var i = 0; i < this.selected_users.length; i++) {
        receipient.push(this.selected_users[i].email);
      }
      this.$apollo
        .mutate({
          mutation: CREATE_CHAT,
          variables: {
            creator: this.master,
            receipient: receipient,
            name: chat_name,
            token: this.token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data.data.CreateChat);
          if (data.data.CreateChat == "Chat Created") {
            this.drawer_state = "";
          }
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
        });
      this.clearUsers();
    },
    clearSearchChatList() {
      this.search_chat_list = "";
    },
    clearSearchChat() {
      this.search_chat = false;
      this.message = "";
    },
    sendMessage() {
      // eslint-disable-next-line
      if (!this.message) {
        return;
      }
      const message = this.message;
      this.message = "";
      this.$apollo
        .mutate({
          mutation: SEND_MESSAGE,
          variables: {
            sender: this.master,
            message: message,
            individualChatId: this.active_chat.id,
            groupChatId: "",
            token: this.token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    setScrollPosition() {
      setTimeout(function() {
        var chat_window = document.getElementById("converse");
        chat_window.scrollTop = chat_window.scrollHeight;
      }, 1);
    },
    notifyPopup(fullMessage) {
      this.$notification.show(
        fullMessage.sender.name,
        {
          body: fullMessage.message
        },
        {}
      );
    },
    uploadFile() {
      var fileToUpload = this.$refs.fileToUpload.files[0]
      if (fileToUpload) {                      // eslint-disable-next-line
      console.log(fileToUpload)
      
      var reader = new FileReader();

    // Closure to capture the file information.
    const scope = this
    reader.onload = (function(theFile) {
     // eslint-disable-next-line
      console.log(theFile)
        return function(e) {
        scope.$apollo
          .mutate({
            mutation: UPLOAD_FILE_MUTATION,
            variables: {
              content: e.target.result,
              filename: fileToUpload,
              individualChatId: this.active_chat.id,
              groupChatId: "",
              token: scope.token
            }
          })
          .then(data => {
            // eslint-disable-next-line
            console.log(data);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
          });
        };
      })(fileToUpload);

      // Read in the image file as a data URL.
      reader.readAsText(fileToUpload);
      }
      // Read in the image file as a data URL.

    
  },
  beforeDestroy() {
    clearInterval(this.refreshing);
  }
  }
};
</script>

<style>
#container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
}

#left_panel {
  width: 256px;
  height: 100%;
  background-color: white;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
  flex: none;
}

#left_panel #chat_list {
  background-color: transparent;
  flex: auto;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  z-index: 1;
}

#left_panel #chat_list .entry {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
}

#left_panel #chat_list .entry:hover {
  background-color: #f5faff;
}

#left_panel #chat_list .entry .profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  font-family: "Roboto Medium", sans-serif;
  font-size: 20px;
  color: white;
  flex: none;
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

#left_panel #chat_list .entry .content {
  width: 100%;
  margin: 0 0 0 8px;
  padding: 0;
  min-width: 0;
}

#left_panel #chat_list .entry .content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#left_panel #chat_list .entry .content .message {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#left_panel #chat_list .entry .counter {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  background-color: transparent;
  margin: 0 0 0 8px;
}

#left_panel #chat_list .entry .counter .badge {
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
  color: white;
  height: 1.5em;
  min-width: 1.5em;
  box-sizing: border-box;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5em;
  border-radius: 0.75em;
  background-color: #3c95ff;
}

#left_panel #toolbar {
  min-width: 5%;
  width: 100%;
  background-color: transparent;
  padding: 8px 12px 8px 12px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex: none;
  z-index: 1;
}

#left_panel #toolbar button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#left_panel #toolbar .menu {
  width: 20px;
  height: 20px;
  padding: 0;
  border-style: none;
  background-color: transparent;
}

#left_panel #toolbar .search {
  min-width: 5%;
  margin: 0 0 0 12px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex: auto;
}

#left_panel #toolbar .search input {
  min-width: 5%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
  flex: auto;
}

#left_panel #toolbar .search button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#drawer {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 256px;
  height: 100%;
  background-color: transparent;
  display: flex;
  flex-flow: column-reverse;
}

#drawer button {
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
  font-size: 14px;
}

#drawer button:hover {
  background-color: #f5faff;
}

#drawer button img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer_new_chat {
  z-index: 3;
  position: fixed;
  bottom: 0;
  width: 256px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}

#drawer_new_chat button,
#drawer_new_chat #counter {
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
  font-size: 14px;
}

#drawer_new_chat button:hover {
  background-color: #f5faff;
}

#drawer_new_chat button img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer_new_chat #counter span {
  font-family: "Roboto Medium", sans-serif;
  color: #3c95ff;
  font-size: 24px;
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  text-align: center;
}

#drawer_new_chat #search {
  width: 240px;
  margin: 4px 8px 8px 8px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#drawer_new_chat #search input {
  width: 100%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
}

#drawer_new_chat #search button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#drawer_new_chat #search button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#drawer_new_chat #people_list,
#drawer_settings #people_list {
  width: 100%;
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: transparent;
  overflow-y: auto;
}

#drawer_new_chat #people_list .entry,
#drawer_settings #people_list .entry {
  background-color: transparent;
  width: 100%;
  max-width: 256px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  flex: none;
}

#drawer_new_chat #people_list .entry:hover,
#drawer_settings #people_list .entry:hover {
  background-color: #f5faff;
}

#drawer_new_chat #people_list .entry .profile,
#drawer_settings #people_list .entry .profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  font-family: "Roboto Medium", sans-serif;
  font-size: 20px;
  color: white;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

#drawer_new_chat #people_list .entry .profile img,
#drawer_settings #people_list .entry .profile img {
  width: 50%;
  height: 50%;
}

#drawer_new_chat #people_list .entry .content,
#drawer_settings #people_list .entry .content {
  margin: 0 0 0 8px;
  padding: 0;
  min-width: 0;
}

#drawer_new_chat #people_list .entry .content .name,
#drawer_settings #people_list .entry .content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#drawer_new_chat #people_list .entry .content .email,
#drawer_settings #people_list .entry .content .email {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#drawer_settings {
  z-index: 4;
  position: fixed;
  bottom: 0;
  width: 256px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}

#drawer_settings #group_name {
  background-color: transparent;
  box-sizing: border-box;
  padding: 8px 8px 4px 8px;
  margin: 0px;
}

#drawer_settings #user {
  background-color: transparent;
  display: flex;
  flex-flow: row nowrap;
  box-sizing: border-box;
  padding: 8px;
}

#drawer_settings #user #profile {
  flex: none;
}

#drawer_settings #user #profile #preview {
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

#drawer_settings #user #profile button {
  padding: 0;
  margin: 4px 0 0 0;
  width: 50px;
  padding: 3px;
  border-radius: 25px;
  box-sizing: border-box;
  border-style: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  background-color: #3c95ff;
}

#drawer_settings #user #profile button:hover {
  background-color: #3c95ffe5;
}

#drawer_settings #user #identity {
  margin: 0 0 0 12px;
  padding: 0;
}

#drawer_settings #user #identity #password {
  padding: 0;
  margin: 8px 0 0 0;
}

#drawer_settings .label {
  color: #404040;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  padding: 0 0 0 6px;
  margin: 0 0 4px 0;
}

#drawer_settings input {
  margin: 0;
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

#drawer_settings .tick_cross {
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
  font-size: 14px;
}

#drawer_settings .tick_cross:hover {
  background-color: #f5faff;
}

#drawer_settings .tick_cross img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#right_panel {
  padding: 0;
  margin: 0;
  flex: auto;
  background-color: transparent;
}

#chat {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column nowrap;
}

#right_panel #chat #header {
  background-color: white;
  width: 100%;
  padding: 16px;
  vertical-align: middle;
  box-sizing: border-box;
  border-left-style: solid;
  border-left-color: #71b1ff;
  border-left-width: 1px;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  color: #000000bf;
  box-shadow: 0 1px 10px #00000019;
  z-index: 2;
}

#right_panel #chat #converse {
  width: 100%;
  flex: auto;
  box-sizing: border-box;
  z-index: 1;
  padding: 8px 0 0px 0;
  overflow-y: auto;
}

#right_panel #chat #converse #entry {
  margin: 0;
  padding: 0;
  background-color: transparent;
  padding: 0px 8px 8px 8px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
}

#right_panel #chat #converse #entry .bubble {
  border-radius: 8px;
  padding: 8px 12px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #404040;
}

#right_panel #chat #converse #entry .bubble_white {
  background-color: white;
}

#right_panel #chat #converse #entry .bubble_green {
  background-color: #b3efc7;
}

#right_panel #chat #converse #entry .author {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0 0 4px 0;
}

#right_panel #chat #converse #entry .message {
  font-family: "Roboto Light", sans-serif;
  margin: 0;
  padding: 0;
}

#right_panel #chat #converse #entry .meta {
  padding: 0;
  margin: 0 0 0 4px;
  color: white;
  font-family: "Roboto Light", sans-serif;
}

#right_panel #chat #compose {
  width: 100%;
  background-color: white;
  padding: 8px 12px 8px 12px;
  margin: 0px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  border-left-style: solid;
  border-left-color: #71b1ff;
  border-left-width: 1px;
  align-items: center;
  box-shadow: 0 -1px 10px #00000019;
  z-index: 2;
}

#right_panel #chat #compose #textbox {
  min-width: 256px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex: auto;
  align-items: center;
}

#right_panel #chat #compose #textbox input {
  min-width: 1%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
  flex: auto;
}

#right_panel #chat #compose #textbox button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#right_panel #chat #compose #textbox img {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
}

#right_panel #chat #compose #search {
  width: 28px;
  height: 28px;
  padding: 7px;
  margin: 0 0 0 8px;
  border-style: none;
  background-color: #3c95ff;
  border-radius: 50%;
  box-sizing: border-box;
}

#right_panel #chat #compose #search img {
  width: 100%;
  height: auto;
}

#right_panel #chat #compose #send {
  border-style: none;
  background-color: #3c95ff;
  border-radius: 14px;
  height: 28px;
  font-family: "Roboto Light", sans-serif;
  color: white;
  text-align: center;
  padding: 4px 8px 4px 8px;
  box-sizing: border-box;
  margin: 0 0 0 8px;
}

#right_panel #chat #compose #search:hover,
#right_panel #chat #compose #send:hover {
  background-color: #3c95ffe5;
}

#right_panel #placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Roboto", sans-serif;
}

.loader {
  width: 12px;
  height: 12px;
  border: 4px solid white;
  border-radius: 50%;
  border-top: 4px solid #3c95ff;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
