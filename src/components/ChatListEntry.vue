<template>
  <div class="entry" v-on:click="selected" v-if="filtered">
    <div v-bind:class="profile">{{initial}}</div>
    <div class="content">
      <div class="name">{{name}}</div>
      <div class="message" v-show="message">{{sender}}: {{message}}</div>
    </div>
    <div class="counter">
      <div class="badge" v-if="chat.count > 0"></div>
    </div>
  </div>
</template>

<script>
import { MESSAGE_SENT } from "@/graphql";
export default {
  name: "ChatListEntry",
  props: ["chat"],
  computed: {
    name: function() {
      return this.chat.__typename == "GroupChat"
        ? this.chat.name
        : this.chat.members.filter(
            x => x.email != this.$parent.$parent.master_email
          )[0].name;
    },
    initial: function() {
      return this.name.charAt(0).toUpperCase();
    },
    sender: function() {
      return this.chat.messages.length > 0
        ? this.chat.messages[this.chat.messages.length - 1].sender.name ==
          "system"
          ? "System"
          : this.chat.messages[this.chat.messages.length - 1].sender.name
        : "";
    },
    json: function() {
      if (this.chat.messages.length > 0 && this.sender != "System") {
        var msg = this.chat.messages[this.chat.messages.length - 1].message;
        if (msg.charAt(0) == "{" && msg.charAt(msg.length - 1) == "}") {
          try {
            return JSON.parse(msg);
          } catch (error) {
            // eslint-disable-next-line
            console.log(error);
            return false;
          }
        }
      }
      return false;
    },
    message: function() {
      if (this.chat.messages.length > 0) {
        var msg = this.chat.messages[this.chat.messages.length - 1].message;
        if (this.sender == "System") {
          return this.$parent.$parent.formatSystemMsg(msg);
        } else if (this.json && this.json.download) {
          return this.json.download.name;
        } else {
          return msg;
        }
      }
      return "";
    },
    filtered: function() {
      return this.$parent.search
        ? RegExp(this.$parent.search, "i").test(this.name)
        : true;
    }
  },
  mounted() {
    var context = this;
    this.$apollo
      .subscribe({
        query: MESSAGE_SENT,
        variables: {
          chatId: this.chat.id,
          chatType: this.chat.__typename,
          recipient: this.$parent.$parent.master_email
        }
      })
      .subscribe({
        next(data) {
          // eslint-disable-next-line
          console.log(data);
          context.chat.messages.push(data.data.MessageSent);
          if (
            data.data.MessageSent.sender.email !=
            context.$parent.$parent.master_email
          ) {
            context.$parent.$parent.notifyPopup(data.data.MessageSent);
          }
          if (data.data.MessageSent.sender.email == "system") {
            var json_obj = JSON.parse(data.data.MessageSent.message);
            if (
              json_obj.newName ||
              json_obj.addedMembers ||
              json_obj.kickedAdminNames ||
              json_obj.kickedMemberNames ||
              json_obj.promotedMembers ||
              json_obj.demotedMembers
            ) {
              context.$parent.refresh(context.chat.__typename, context.chat.id);
            }
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
  data() {
    return {
      profile: this.initProfile()
    };
  },
  methods: {
    initProfile() {
      var shape =
        this.chat.__typename === "IndividualChat"
          ? "profile_individual"
          : "profile_group";
      var color = "";
      switch (this.chat.id.charCodeAt(this.chat.id.length - 1) % 6) {
        case 0:
          color = "profile_red";
          break;
        case 1:
          color = "profile_orange";
          break;
        case 2:
          color = "profile_green";
          break;
        case 3:
          color = "profile_blue";
          break;
        case 4:
          color = "profile_indigo";
          break;
        case 5:
          color = "profile_violet";
          break;
      }
      return "profile " + shape + " " + color;
    },
    selected() {
      this.chat.name = this.name;
      this.$parent.$parent.active_chat = this.chat;
      this.chat.count = 0;
    }
  }
};
</script>

<style scoped>
.entry {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
}

.entry:hover {
  background-color: #f5faff;
}

.entry .profile {
  width: 40px;
  height: 40px;
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

.entry .content {
  width: 100%;
  margin: 0 0 0 8px;
  padding: 0;
  min-width: 0;
}

.entry .content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.entry .content .message {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.entry .counter {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  background-color: transparent;
  margin: 0 0 0 8px;
}

.entry .counter .badge {
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

.profile_individual {
  border-radius: 50%;
}

.profile_group {
  border-radius: 20%;
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
