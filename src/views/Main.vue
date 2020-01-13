<template>
  <div id="frame">
    <div v-show="active_chat" style="visibility:hidden; opacity:0" id="dropzone">
      <div id="textnode">Drop your files here.</div>
    </div>
    <div id="left_panel">
      <NavBar v-show="left_panel_active_component == 'NavBar'" ref="NavBar"/>
      <DrawerMenu v-show="left_panel_active_component == 'DrawerMenu'"/>
      <DrawerNewChat
        v-show="left_panel_active_component == 'DrawerNewChat'"
        v-bind:key="key_drawer_new_chat"
      />
      <DrawerAccount
        v-show="left_panel_active_component == 'DrawerAccount'"
        v-bind:key="key_drawer_account"
      />
      <ChatDrawerMenu v-show="left_panel_active_component == 'ChatDrawerMenu'"/>
      <ChatDrawerName
        v-show="left_panel_active_component == 'ChatDrawerName'"
        v-bind:key="key_chat_drawer_name"
      />
      <ChatDrawerAddMember
        v-show="left_panel_active_component == 'ChatDrawerAddMember'"
        v-bind:key="key_chat_drawer_add_member"
      />
      <ChatDrawerRemoveMember
        v-show="left_panel_active_component == 'ChatDrawerRemoveMember'"
        v-bind:key="key_chat_drawer_remove_member"
      />
      <ChatDrawerAddAdmin
        v-show="left_panel_active_component == 'ChatDrawerAddAdmin'"
        v-bind:key="key_chat_drawer_add_admin"
      />
      <ChatDrawerRemoveAdmin
        v-show="left_panel_active_component == 'ChatDrawerRemoveAdmin'"
        v-bind:key="key_chat_drawer_remove_admin"
      />
      <ChatDrawerUpload
        v-show="left_panel_active_component == 'ChatDrawerUpload'"
        v-bind:key="key_chat_drawer_upload"
        ref="chat_drawer_upload"
      />
    </div>
    <div id="right_panel">
      <ChatWindow v-if="active_chat" v-bind:key="active_chat.id"/>
      <div id="placeholder" v-else>Please select a chat.</div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import DrawerMenu from "@/components/DrawerMenu.vue";
import DrawerNewChat from "@/components/DrawerNewChat.vue";
import DrawerAccount from "@/components/DrawerAccount.vue";
import ChatWindow from "@/components/ChatWindow.vue";
import ChatDrawerMenu from "@/components/ChatDrawerMenu.vue";
import ChatDrawerName from "@/components/ChatDrawerName.vue";
import ChatDrawerAddMember from "@/components/ChatDrawerAddMember.vue";
import ChatDrawerRemoveMember from "@/components/ChatDrawerRemoveMember.vue";
import ChatDrawerAddAdmin from "@/components/ChatDrawerAddAdmin.vue";
import ChatDrawerRemoveAdmin from "@/components/ChatDrawerRemoveAdmin.vue";
import ChatDrawerUpload from "@/components/ChatDrawerUpload.vue";
import { GET_USERS, REFRESH_TOKEN_MUTATION } from "@/graphql";
export default {
  name: "Main",
  components: {
    NavBar,
    DrawerMenu,
    DrawerNewChat,
    DrawerAccount,
    ChatWindow,
    ChatDrawerMenu,
    ChatDrawerName,
    ChatDrawerAddMember,
    ChatDrawerRemoveMember,
    ChatDrawerAddAdmin,
    ChatDrawerRemoveAdmin,
    ChatDrawerUpload
  },
  created() {
    if (
      !window.sessionStorage.getItem("master_email") ||
      !window.sessionStorage.getItem("master_name") ||
      !window.sessionStorage.getItem("jwtToken")
    ) {
      this.logoutUser();
    }
    window.addEventListener("load", function() {
      document.getElementsByClassName("grecaptcha-badge")[0].style.visibility =
        "collapse";
    });
    this.oneRefreshToken();
    this.refreshToken();
    this.getMasterUser();
  },
  computed: {
    left_panel_active_component: function() {
      return this.left_panel_active_stack[
        this.left_panel_active_stack.length - 1
      ];
    }
  },
  mounted() {
    var context = this;
    window.addEventListener("dragenter", function(e) {
      e.preventDefault();
      document.querySelector("#dropzone").style.visibility = "";
      document.querySelector("#dropzone").style.opacity = 1;
    });

    window.addEventListener("dragleave", function(e) {
      e.preventDefault();
      document.querySelector("#dropzone").style.visibility = "hidden";
      document.querySelector("#dropzone").style.opacity = 0;
    });

    window.addEventListener("dragover", function(e) {
      e.preventDefault();
      document.querySelector("#dropzone").style.visibility = "";
      document.querySelector("#dropzone").style.opacity = 1;
    });

    window.addEventListener("drop", function(e) {
      e.preventDefault();
      document.querySelector("#dropzone").style.visibility = "hidden";
      document.querySelector("#dropzone").style.opacity = 0;
      if (context.active_chat) {
        if (context.left_panel_active_component != "ChatDrawerUpload") {
          context.addLeftPanelActiveComponent("ChatDrawerUpload");
          context.upload_queue_buffer = e.dataTransfer.files;
        } else {
          context.$refs.chat_drawer_upload.enqueue_upload(e.dataTransfer.files);
        }
      }
    });
  },
  data() {
    return {
      master_user: "",
      master_email: window.sessionStorage.getItem("master_email"),
      session_token: window.sessionStorage.getItem("jwtToken"),
      active_chat: "",
      refreshing: null,
      left_panel_active_stack: ["NavBar"],
      key_drawer_new_chat: Math.random(),
      key_drawer_account: Math.random(),
      key_chat_drawer_name: Math.random(),
      key_chat_drawer_add_member: Math.random(),
      key_chat_drawer_remove_member: Math.random(),
      key_chat_drawer_add_admin: Math.random(),
      key_chat_drawer_remove_admin: Math.random(),
      key_chat_drawer_upload: Math.random(),
      upload_queue_buffer: []
    };
  },
  methods: {
    getMasterUser() {
      this.$apollo
        .query({
          query: GET_USERS,
          variables: {
            email: this.master_email,
            token: this.session_token
          }
        })
        .then(data => {
          this.master_user = data.data.GetUsers[0];
        })
        .catch(error => {
          var gqlError = error.graphQLErrors;
          if (gqlError.length > 0) {
            if (gqlError[0].message.includes("Invalid token.")) {
              this.expireSession();
            }
          }
        });
    },
    logoutUser() {
      document.getElementsByClassName("grecaptcha-badge")[0].style.visibility =
        "visible";
      window.sessionStorage.removeItem("master_email");
      window.sessionStorage.removeItem("jwtToken");
      window.sessionStorage.removeItem("master_name");
      window.sessionStorage.removeItem("reset_email");
      window.sessionStorage.removeItem("verify_email");
      
      this.$router.replace("/");
    },
    expireSession() {
      document.getElementsByClassName("grecaptcha-badge")[0].style.visibility =
        "visible";
      window.sessionStorage.removeItem("master_email");
      window.sessionStorage.removeItem("jwtToken");
      window.sessionStorage.removeItem("master_name");
      window.sessionStorage.removeItem("reset_email");
      window.sessionStorage.removeItem("verify_email");
       this.$router.replace({
              name: "Login",
              params: {
                message: "You have an invalid session, please login again.",
                message_style: "message negative"
              }
            });
    },
    notifyPopup(fullMessage) {
      var messageToSend = ""
      var sender = ""
      
      if (fullMessage.sender.name != "system") {
        try {
          var output = JSON.parse(fullMessage.message);
          if (output["download"]) {
            messageToSend = output["download"].name + " has been uploaded."
          } 
        } catch(e) {
          messageToSend = fullMessage.message
        }
        
        if (fullMessage.groupChatName) {
          sender = fullMessage.sender.name + " (" + fullMessage.groupChatName + ")"
        } else {
          sender = fullMessage.sender.name
        }
        
        this.$notification.show(
          sender,
          {
            body: messageToSend
          },
          {}
        );
      }
    },
    oneRefreshToken() {
      this.$apollo
        .mutate({
          mutation: REFRESH_TOKEN_MUTATION,
          variables: {
            email: this.master_email,
            token: this.session_token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          window.sessionStorage.setItem("jwtToken", data.data.RefreshToken);
          this.session_token =window.sessionStorage.getItem("jwtToken");
        })
        .catch(error => {
          var gqlError = error.graphQLErrors;

          if (gqlError.length > 0) {
            if (gqlError[0].message.includes("Invalid token.")) {
              this.expireSession();
            }
          }
        });
    },
    refreshToken() {
      this.refreshing = setInterval(() => {
        this.$apollo
          .mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
              email: this.master_email,
              token: this.session_token
            }
          })
          .then(data => {
            window.sessionStorage.setItem("jwtToken", data.data.RefreshToken);
            this.session_token =window.sessionStorage.getItem("jwtToken");
          })
          .catch(error => {
            var gqlError = error.graphQLErrors;

            if (gqlError.length > 0) {
              if (gqlError[0].message.includes("Invalid token.")) {
                this.expireSession();
              }
            }
          });
      }, 840000);
    },
    randomiseKey() {
      this.key_drawer_new_chat = Math.random();
      this.key_drawer_account = Math.random();
      this.key_chat_drawer_name = Math.random();
      this.key_chat_drawer_add_member = Math.random();
      this.key_chat_drawer_remove_member = Math.random();
      this.key_chat_drawer_add_admin = Math.random();
      this.key_chat_drawer_remove_admin = Math.random();
      this.key_chat_drawer_upload = Math.random();
    },
    addLeftPanelActiveComponent(component_name) {
      this.randomiseKey();
      this.left_panel_active_stack.push(component_name);
    },
    removeLeftPanelActiveComponent() {
      this.left_panel_active_stack.pop();
    },
    resetLeftPanelActiveComponent() {
      this.left_panel_active_stack = ["NavBar"];
    },
    formatSystemMsg(json_text) {
      var json_obj = JSON.parse(json_text);
      var text = "Formatter Error!";
      if (json_obj.newName) {
        text = "New chat name: " + json_obj.newName;
      } else if (json_obj.addedMembers) {
        text =
          "New member" +
          (json_obj.addedMembers.length > 1 ? "s" : "") +
          " joined the chat:";
        for (const member of json_obj.addedMembers) {
          text += "\n" + member;
        }
      } else if (json_obj.kickedAdminNames || json_obj.kickedMemberNames) {
        var kicked_names_count =
          (json_obj.kickedAdminNames ? json_obj.kickedAdminNames.length : 0) +
          (json_obj.kickedMemberNames ? json_obj.kickedMemberNames.length : 0);
        text =
          "Member" + (kicked_names_count > 1 ? "s" : "") + " left the chat:";
        if (json_obj.kickedAdminNames) {
          for (const member of json_obj.kickedAdminNames) {
            text += "\n" + member;
          }
        }
        if (json_obj.kickedMemberNames) {
          for (const member of json_obj.kickedMemberNames) {
            text += "\n" + member;
          }
        }
      } else if (json_obj.promotedMembers) {
        text =
          "Newly appointed admin" +
          (json_obj.promotedMembers.length > 1 ? "s" : "") +
          " :";
        for (const member of json_obj.promotedMembers) {
          text += "\n" + member;
        }
      } else if (json_obj.demotedMembers) {
        text =
          "Member" +
          (json_obj.demotedMembers.length > 1 ? "s" : "") +
          " removed from admin rights:";
        for (const member of json_obj.demotedMembers) {
          text += "\n" + member;
        }
      }
      return text;
    }
  }
};
</script>

<style scoped>
#frame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
#left_panel {
  width: 256px;
  min-width: 256px;
  height: 100%;
  background-color: white;
  z-index: 3;
}
#right_panel {
  flex: auto;
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
#dropzone {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: visibility 175ms, opacity 175ms;
  display: table;
  text-shadow: 1px 1px 2px #000;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  font: bold 42px Oswald, DejaVu Sans, Tahoma, sans-serif;
}
#textnode {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  transition: font-size 175ms;
}
</style>
