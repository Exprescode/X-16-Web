<template>
  <div class="entry">
    <div class="profile profile_red">{{initial}}</div>
    <div class="content">
      <div class="name">{{chat_list_entry.name}}</div>
      <div class="message">{{chat_list_entry.msg}}</div>
    </div>
    <div class="counter">
      <div class="badge" v-if="chat_list_entry.count > 0">{{chat_list_entry.count}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatListEntry",
  props: ["chat_list_entry"],
  data() {
    return {
      initial: this.getInitial(this.chat_list_entry.name)
    };
  },
  methods: {
    getInitial(name) {
      return name.charAt(0).toUpperCase();
    }
  }
};
</script>

<style>
</style>
