<template>
  <div class="entry" v-on:click="selected">
    <div class="profile profile_red">{{initial}}</div>
    <div class="content">
      <div class="name">{{chat.name}}</div>
      <div class="message">{{chat.converse[chat.converse.length - 1].text}}</div>
    </div>
    <div class="counter">
      <div class="badge" v-if="chat.count > 0">{{chat.count}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatListEntry",
  props: ["chat"],
  data() {
    return {
      initial: this.chat.name.charAt(0).toUpperCase()
    };
  },
  methods: {
    selected() {
      this.$parent.setActiveChat(this.chat);
      this.chat.count = 0;
    }
  }
};
</script>

<style>
</style>
