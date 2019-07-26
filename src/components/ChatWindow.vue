<template>
  <div id="window">
    <div id="header">
      <div>{{chat.name}}</div>
      <button v-on:click="selectMenu">
        <img src="../assets/menu_dot.png">
      </button>
    </div>
    <div id="content">
      <ChatEntry v-for="entry in chat.messages" v-bind:entry="entry" v-bind:key="entry.id"/>
    </div>
    <div id="compose">
      <div id="textbox">
        <input
          type="text"
          placeholder="Compose message here."
          v-model="message"
          v-on:keyup.enter="send"
          spellcheck="false"
        >
      </div>
      <button id="search" v-on:click="search=false" v-if="search">
        <img src="../assets/cross_2_white.png">
      </button>
      <button id="search" v-on:click="search=true" v-else>
        <img src="../assets/magnifying_glass.png">
      </button>
      <button v-on:click="send()" id="send">SEND</button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import ChatEntry from "@/components/ChatEntry.vue";
import { SEND_MESSAGE, CREATE_POLL, VOTE_POLL, GET_POLL } from "@/graphql";
export default {
  name: "ChatWindow",
  components: {
    ChatEntry
  },
  created() {
    this.debouncedSetScrollPosition = _.debounce(this.setScrollPosition, 100);
  },
  mounted: function() {
    this.setScrollPosition();
  },
  computed: {
    chat: function() {
      return this.$parent.active_chat;
    },
    message_count: function() {
      return this.$parent.active_chat.messages.length;
    }
  },
  watch: {
    message_count: function() {
      this.debouncedSetScrollPosition();
    }
  },
  data() {
    return {
      message: "",
      search: false
    };
  },
  methods: {
    send() {
      this.search = false;
      const message = this.message;
      this.message = "";
      if (!message) {
        return;
      } else if (
        this.$parent.active_chat.__typename == "GroupChat" &&
        message.charAt(0) == "@"
      ) {
        var params = message.split(" -");
        var cmd_header = params.shift().split(" ");
        var cmd = cmd_header.shift();
        params = [...cmd_header, ...params];
        if (cmd == "@poll") {
          //eslint-disable-next-line
          console.log(params);
          this.cmd_poll(params);
        } else {
          this.sendMessage(message);
        }
      } else {
        this.sendMessage(message);
      }
    },
    cmd_poll(params) {
      const context = this;
      var fn = params.shift();
      if (fn == "create" && params.length > 2) {
        var qn = params.shift();
        var msg_prep =
          "A new poll has started!\n\nQuestion:\n" + qn + "\n\nOptions:";
        for (var i = 0; i < params.length; ++i) {
          msg_prep += "\n" + (i + 1) + ".\t" + params[i];
        }
        const msg = msg_prep;
        this.$apollo
          .mutate({
            mutation: CREATE_POLL,
            variables: {
              id: this.chat.id,
              question: qn,
              options: params,
              token: this.$parent.session_token
            }
          })
          .then(data => {
            // eslint-disable-next-line
            console.log(data);
            context.sendMessage(msg);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            context.sendMessage("System error! Try again later.");
          });
      } else if (fn == "vote" && params.length > 0 && !isNaN(params[0])) {
        this.$apollo
          .mutate({
            mutation: VOTE_POLL,
            variables: {
              id: this.chat.id,
              email: this.$parent.master_email,
              option: +params[0] - 1,
              token: this.$parent.session_token
            }
          })
          .then(data => {
            // eslint-disable-next-line
            console.log(data);
            context.sendMessage("I have casted my vote!");
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            context.sendMessage("Invalid vote!");
          });
      } else if (fn == "result") {
        this.$apollo
          .query({
            query: GET_POLL,
            variables: {
              id: this.chat.id,
              token: this.$parent.session_token
            },
            fetchPolicy: "no-cache"
          })
          .then(data => {
            // eslint-disable-next-line
            console.log(data);
            var msg =
              "This are the poll results!\n\nQuestion:\n" +
              data.data.GetPoll.question +
              "\n\nOptions/Results:";
            for (var i = 0; i < data.data.GetPoll.options.length; ++i) {
              msg +=
                "\n" +
                data.data.GetPoll.answers[i] +
                " vote" +
                (data.data.GetPoll.answers[i] > 1 ? "s" : "") +
                ":\t" +
                data.data.GetPoll.options[i];
            }
            context.sendMessage(msg);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.log(error);
            context.sendMessage("No existing poll!");
          });
      } else {
        this.sendMessage(
          "Invalid poll command!\nPoll command examples:\n@poll create -<QUESTION> -<OPTION 1> -<OPTION 2> [-<OPTION 3> ...]\n@poll vote <OPTION NUMBER>\n@poll result"
        );
      }
    },
    sendMessage(message) {
      if (!message) {
        return;
      }
      var individual_chat_id =
        this.$parent.active_chat.__typename === "IndividualChat"
          ? this.$parent.active_chat.id
          : "";
      var group_chat_id =
        this.$parent.active_chat.__typename === "GroupChat"
          ? this.$parent.active_chat.id
          : "";
      this.$apollo
        .mutate({
          mutation: SEND_MESSAGE,
          variables: {
            sender: this.$parent.master_email,
            message: message,
            individualChatId: individual_chat_id,
            groupChatId: group_chat_id,
            token: this.$parent.session_token
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
      document.getElementById("content").scrollTop = document.getElementById(
        "content"
      ).scrollHeight;
    },
    selectMenu() {
      if (this.$parent.left_panel_active_component == "ChatDrawerMenu") {
        this.$parent.removeLeftPanelActiveComponent();
      } else {
        this.$parent.addLeftPanelActiveComponent("ChatDrawerMenu");
      }
    },
    download(json) {
      var chat_type =
        this.$parent.active_chat.__typename == "IndividualChat"
          ? "Individual"
          : "Group";
      axios({
        url:
          "https://chat.lukeng.io:80/files/" +
          chat_type +
          "/" +
          this.$parent.active_chat.id +
          "/" +
          json.download.id, // https://chat.lukeng.io/files/{Group,Individual}/{ChatID}/{FileID}
        method: "GET",
        responseType: "blob",
        headers: { Authorization: `Bearer ${this.$parent.session_token}` }
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", json.download.name);
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>

<style scoped>
#window {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

#header {
  background-color: white;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-left-style: solid;
  border-left-color: #71b1ff;
  border-left-width: 1px;
  box-shadow: 0 1px 10px #00000019;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

#header div {
  flex: auto;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  color: #000000bf;
}

#header button {
  width: 20px;
  height: 20px;
  border-style: none;
  background-color: transparent;
  padding: 0;
  margin: 0 0 0 6px;
}

#header button img {
  width: 100%;
  height: 100%;
}

#content {
  min-width: 256px;
  flex: auto;
  box-sizing: border-box;
  z-index: 1;
  padding: 8px 0 0px 0;
  overflow-y: auto;
}

#compose {
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

#textbox {
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex: auto;
  align-items: center;
}

#textbox input {
  min-width: 1%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 14px;
  background-color: transparent;
  flex: auto;
}

#textbox button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#textbox img {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#search {
  width: 28px;
  height: 28px;
  padding: 7px;
  margin: 0 0 0 8px;
  border-style: none;
  background-color: #3c95ff;
  border-radius: 50%;
  box-sizing: border-box;
}

#search img {
  width: 100%;
  height: auto;
}

#send {
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

#search:hover,
#send:hover {
  background-color: #3c95ffe5;
}
</style>
