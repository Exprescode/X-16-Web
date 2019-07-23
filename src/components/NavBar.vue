<template>
  <div id="nav_bar">
    <div id="chat_list">
      <ChatListEntry v-for="chat in chats" v-bind:chat="chat" v-bind:key="chat.id"/>
    </div>
    <div id="toolbar">
      <button id="menu" v-on:click="selectMenu">
        <img src="../assets/menu.png">
      </button>
      <div id="search">
        <input type="text" placeholder="Search" v-model="search">
        <button v-show="search" v-on:click="search=''">
          <img src="../assets/cross.png">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatListEntry from "@/components/ChatListEntry.vue";
import {
  GET_INDIVIDUAL_CHATS,
  INDIVIDUAL_CHAT_SUB,
  GET_GROUP_CHATS,
  GROUP_CHAT_SUB,
  UPDATE_MESSAGE_SENT
} from "@/graphql";
export default {
  name: "NavBar",
  components: {
    ChatListEntry
  },
  computed: {
    chats: function() {
      return [...this.GetIndividualChats, ...this.GetGroupChats];
    }
  },
  data() {
    return {
      search: "",
      GetIndividualChats: [],
      GetGroupChats: [],
      refresh_active_chat: false
    };
  },
  apollo: {
    GetIndividualChats: {
      query: GET_INDIVIDUAL_CHATS,
      variables() {
        return {
          email: this.$parent.master_email,
          token: this.$parent.session_token
        };
      },
      result({ data, loading }) {
        if (!loading && this.refresh_active_chat) {
          this.refreshActiveChat(data.GetIndividualChats);
        }
      },
      subscribeToMore: {
        document: INDIVIDUAL_CHAT_SUB,
        variables() {
          return {
            email: this.$parent.master_email
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
    },
    GetGroupChats: {
      query: GET_GROUP_CHATS,
      variables() {
        return {
          email: this.$parent.master_email,
          token: this.$parent.session_token
        };
      },
      result({ data, loading }) {
        if (!loading && this.refresh_active_chat) {
          this.refreshActiveChat(data.GetGroupChats);
        }
      },
      subscribeToMore: {
        document: GROUP_CHAT_SUB,
        variables() {
          return {
            email: this.$parent.master_email
          };
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            GetGroupChats: [
              subscriptionData.data.GroupChatCreated,
              ...previousResult.GetGroupChats
            ]
          };
        }
      }
    }
  },
  mounted() {
    var context = this;
    this.$apollo
      .subscribe({
        query: UPDATE_MESSAGE_SENT,
        variables: {
          email: this.$parent.master_email
        }
      })
      .subscribe({
        next(data) {
          // eslint-disable-next-line
          console.log(data);
          var json_obj = JSON.parse(data.data.UpdateMessageSent);
          if (json_obj.chatDeleted) {
            context.refresh(
              json_obj.chatDeleted.groupType,
              json_obj.chatDeleted.chatId
            );
          }
        },
        error(error) {
          // eslint-disable-next-line
          console.log("Error code: 507698");
          // eslint-disable-next-line
          console.log(error);
        }
      });
  },
  methods: {
    selectMenu() {
      this.$parent.addLeftPanelActiveComponent("DrawerMenu");
    },
    refreshActiveChat(chats) {
      var chat_array = chats.filter(x => x.id == this.$parent.active_chat.id);
      this.$parent.active_chat = chat_array.length > 0 ? chat_array[0] : "";
      this.refresh_active_chat = false;
    },
    refresh(chat_type, chat_id) {
      this.refresh_active_chat =
        this.$parent.active_chat && this.$parent.active_chat.id == chat_id;
      if (chat_type == "GroupChat") {
        this.$apollo.queries.GetGroupChats.refetch();
      } else {
        this.$apollo.queries.GetIndividualChats.refetch();
      }
    }
  }
};
</script>

<style scoped>
button img {
  width: 100%;
  height: 100%;
  margin: 0;
}

#nav_bar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  flex: none;
}

#chat_list {
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

#toolbar {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px 8px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#toolbar #menu {
  width: 20px;
  height: 20px;
  border-style: none;
  flex: none;
  background-color: transparent;
  padding: 0;
}

#toolbar #search {
  flex: auto;
  margin: 0 0 0 12px;
  padding: 8px;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#toolbar #search input {
  flex: auto;
  min-height: 1em;
  max-height: 1em;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 14px;
  background-color: transparent;
}

#toolbar #search button {
  border-style: none;
  background-color: transparent;
  margin: 0 0 0 8px;
  height: 12px;
  width: 12px;
  padding: 0;
  flex: none;
}
</style>
