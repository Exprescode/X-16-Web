<template>
  <div v-bind:class="frame" v-if="display">
    <div class="meta" v-show="owner">
      <!-- <div class="status">Delivered</div> -->
      <div class="timestamp">{{timestamp}}</div>
    </div>
    <div v-bind:class="bubble">
      <div class="author">{{author}}</div>
      <div class="message">{{entry.message}}</div>
    </div>
    <div class="meta" v-show="!owner">
      <!-- <div class="status">Delivered</div> -->
      <div class="timestamp">{{timestamp}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatEntry",
  props: ["entry"],
  computed: {
    timestamp: function() {
      var date = new Date(this.entry.datetime);
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
      return this.entry.sender.email === this.$parent.$parent.master_email;
    },
    frame: function() {
      return "entry " + (this.owner ? "entry_right" : "entry_Left");
    },
    author: function() {
      return this.owner ? "You" : this.entry.sender.name;
    },
    bubble: function() {
      return "bubble " + (this.owner ? "bubble_green" : "bubble_white");
    },
    display: function() {
      return this.$parent.search
        ? this.$parent.message
          ? RegExp(this.$parent.message, "i").test(this.entry.message)
          : true
        : true;
    }
  }
};
</script>

<style scoped>
.entry {
  margin: 0;
  padding: 0;
  background-color: transparent;
  padding: 0px 8px 8px 8px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.entry_left {
  justify-content: flex-start;
}

.entry_right {
  justify-content: flex-end;
}

.bubble {
  border-radius: 8px;
  padding: 8px 12px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #404040;
}

.bubble_white {
  background-color: white;
}

.bubble_green {
  background-color: #b3efc7;
}

.author {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0 0 4px 0;
}

.message {
  font-family: "Roboto Light", sans-serif;
  margin: 0;
  padding: 0;
}

.meta {
  padding: 0;
  margin: 0 4px 0 4px;
  color: white;
  font-family: "Roboto Light", sans-serif;
}
</style>
