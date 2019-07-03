<template>
  <div class="entry" v-on:click="selected">
    <div class="profile profile_red">{{initial}}</div>
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
          context.$parent.setScrollPosition();
        },
        error(error) {
          // eslint-disable-next-line
          console.log("Error code: 507698");
          // eslint-disable-next-line
          console.log(error);
        }
      });
    // this.$apollo.addSmartSubscription({
    //   document: gql`
    //     subscription($chatId: String!, $chatType: String!, $sender: String!) {
    //       MessageSent(chatId: $chatId, chatType: $chatType, sender: $sender) {
    //         id
    //         sender {
    //           id
    //           email
    //           name
    //         }
    //         datetime
    //         message
    //       }
    //     }
    //   `,
    //   variables() {
    //     return {
    //       chatId: this.chat.id,
    //       chatType: this.chat.__typename,
    //       sender: this.chat.members[0].email
    //     };
    //   },
    //   result(data) {
    //     // eslint-disable-next-line
    //     console.log(data);
    //     this.chat.messages.push(data);
    //   }
    // });
    // this.chat_subscriptions = [];
    // for (var i = 0; i < this.chat.members.length; i++) {
    //   // eslint-disable-next-line
    //   console.log(this.chat.id + ":" + this.chat.members[i].name);
    // }
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
