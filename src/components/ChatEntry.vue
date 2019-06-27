<template>
  <div id="entry">
    <div class="bubble">
      <div class="author">{{converse.sender.name}}</div>
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
        date.getDate() +
        "." +
        (date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    }
  }
};
</script>

<style>
</style>
