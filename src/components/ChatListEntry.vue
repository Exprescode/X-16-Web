<template>
  <div class="entry" v-on:click="selected">
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
import gql from "graphql-tag";
export default {
  name: "ChatListEntry",
  props: ["chat"],
  computed: {
    name: function() {
      if (this.chat.__typename === "GroupChat") {
        return this.chat.name;
      }
      for (var i = 0; i < this.chat.members.length; i++) {
        if (this.chat.members[i].email != this.$parent.master) {
          return this.chat.members[i].name;
        }
      }
      return this.chat.members[1].name;
    },
    initial: function() {
      return this.name.charAt(0).toUpperCase();
    },
    message: function() {
      if (this.chat.messages.length < 1) {
        return "";
      }
      return this.chat.messages[this.chat.messages.length - 1].message;
    },
    sender: function() {
      if (this.chat.messages.length < 1) {
        return "";
      }
      return this.chat.messages[this.chat.messages.length - 1].sender.name;
    },
    profile: function() {
      var shape =
        this.chat.__typename === "IndividualChat"
          ? "profile_individual"
          : "profile_group";
      var color_index = this.chat.id.charCodeAt(this.chat.id.length - 1) % 6;
      var colors = [
        "profile_red",
        "profile_orange",
        "profile_green",
        "profile_blue",
        "profile_indigo",
        "profile_violet"
      ];
      return "profile " + shape + " " + colors[color_index];
    }
  },
  mounted() {
    const subQuery = gql`
      subscription($chatId: String!, $chatType: String!, $recipient: String!) {
        MessageSent(
          chatId: $chatId
          chatType: $chatType
          recipient: $recipient
        ) {
          id
          sender {
            id
            email
            name
          }
          datetime
          message
        }
      }
    `;
    var context = this;
    this.$apollo
      .subscribe({
        query: subQuery,
        variables: {
          chatId: this.chat.id,
          chatType: this.chat.__typename,
          recipient: this.$parent.master
        }
      })
      .subscribe({
        next(data) {
          // eslint-disable-next-line
          console.log(context.chat.id);
          context.chat.messages.push(data.data.MessageSent);
          context.$parent.notifyPopup(data.data.MessageSent);
          context.$parent.setScrollPosition();
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
    selected() {
      this.chat.name = this.name;
      this.$parent.setActiveChat(this.chat);
      this.chat.count = 0;
    },
    setSubscription(sender) {
      sender;
    }
  }
};
</script>

<style>
</style>
