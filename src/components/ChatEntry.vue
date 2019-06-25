<template>
  <div id="entry">
    <div class="bubble">
      <div class="author">Henry</div>
      <div class="message">{{converse.text}}</div>
    </div>
    <div class="meta">
      <!-- <div class="status">Delivered</div> -->
      <div class="timestamp">{{formatTime(converse.time)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatEntry",
  props: ["converse"],
  data() {},
  methods: {
    formatTime(time) {
      var date = new Date(time);
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
