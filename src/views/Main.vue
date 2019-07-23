<template>
  <div id="frame">
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
    ChatDrawerRemoveAdmin
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
  data() {
    return {
      master_user: "",
      master_email: window.sessionStorage.getItem("master_email"),
      session_token: window.sessionStorage.getItem("jwtToken"),
      active_chat: "",
      left_panel_active_stack: ["NavBar"],
      key_drawer_new_chat: Math.random(),
      key_drawer_account: Math.random(),
      key_chat_drawer_name: Math.random(),
      key_chat_drawer_add_member: Math.random(),
      key_chat_drawer_remove_member: Math.random(),
      key_chat_drawer_add_admin: Math.random(),
      key_chat_drawer_remove_admin: Math.random()
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
    logoutUser() {
      document.getElementsByClassName("grecaptcha-badge")[0].style.visibility =
        "visible";
      window.sessionStorage.removeItem("master_email");
      window.sessionStorage.removeItem("jwtToken");
      this.$router.replace("/");
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
        this.$apollo
          .mutate({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
              email: this.master_email,
              token: this.token
            }
          })
          .then(data => {
            window.sessionStorage.setItem("jwtToken", data.data.RefreshToken);
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
    randomiseKey() {
      this.key_drawer_new_chat = Math.random();
      this.key_drawer_account = Math.random();
      this.key_chat_drawer_name = Math.random();
      this.key_chat_drawer_add_member = Math.random();
      this.key_chat_drawer_remove_member = Math.random();
      this.key_chat_drawer_add_admin = Math.random();
      this.key_chat_drawer_remove_admin = Math.random();
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
</style>
