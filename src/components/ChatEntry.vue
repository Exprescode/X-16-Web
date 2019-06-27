<template>
  <div id="entry">
    <div class="bubble" v-bind:class="tint">
      <div class="author">{{author}}</div>
      <div class="message">{{converse.message}}</div>
    </div>
    <div class="meta">
      <!-- <div class="status">Delivered</div> -->
      <div class="timestamp">{{timestamp}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatEntry",
  props: ["converse"],
  computed: {
    timestamp: function() {
      var date = new Date(this.converse.datetime);
      return (
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "." +
        (date.getMonth() < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        " " +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes()
      );
    },
    owner: function() {
      return this.converse.sender.email === this.$parent.master;
    },
    author: function() {
      return this.owner ? "You" : this.converse.sender.name;
    },
    tint: function() {
      return (this.owner ? "bubble_green" : "bubble_white") + " bubble";
    }
  }
};
</script>

<style>
</style>
