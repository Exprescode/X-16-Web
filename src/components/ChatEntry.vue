<template>
  <div v-bind:class="position" v-if="display">
    <div class="meta" v-if="owner && !system">
      <!-- <div class="status">Delivered</div> -->
      <div class="timestamp">{{timestamp}}</div>
    </div>
    <div v-bind:class="bubble">
      <div class="author" v-if="!system">{{author}}</div>
      <div v-if="json" class="download">
        <button
          v-on:click="$parent.download(json)"
          v-on:mouseover="download_btn_hover = true"
          v-on:mouseleave="download_btn_hover = false"
        >
          <img v-if="download_btn_hover" src="../assets/download_blue.png">
          <img v-else src="../assets/download.png">
        </button>
        <div class="file_info">
          <div class="file_name">{{json.download.name}}</div>
          <div class="file_size">{{formatFileSize(json.download.size)}}</div>
        </div>
      </div>
      <div v-else v-bind:class="{message: true, message_center: system}">{{message}}</div>
    </div>
    <div class="meta" v-if="!owner && !system">
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
    system: function() {
      return this.entry.sender.email == "system";
    },
    position: function() {
      return (
        "entry " +
        (this.system
          ? "entry_center"
          : this.owner
          ? "entry_right"
          : "entry_Left")
      );
    },
    author: function() {
      return this.owner ? "You" : this.entry.sender.name;
    },
    message_class: function() {
      return "message " + (this.system ? "message_center" : "");
    },
    json: function() {
      if (
        !this.system &&
        this.entry.message.charAt(0) == "{" &&
        this.entry.message.charAt(this.entry.message.length - 1) == "}"
      ) {
        try {
          return JSON.parse(this.entry.message);
        } catch (error) {
          // eslint-disable-next-line
          console.log(error);
          return false;
        }
      }
      return false;
    },
    message: function() {
      return this.system
        ? this.$parent.$parent.formatSystemMsg(this.entry.message)
        : this.json
        ? ""
        : this.entry.message;
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
  },
  data() {
    return {
      download_btn_hover: false
    };
  },
  methods: {
    formatFileSize(size) {
      var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
      return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " +
        ["B", "kB", "MB", "GB", "TB"][i]
      );
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

.entry_center {
  justify-content: center;
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
  background-color: #d4eddc;
}

.author {
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0 0 4px 0;
}

.download {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.download button {
  flex: none;
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 0;
  border-style: none;
  background-color: transparent;
}

.download button img {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.download .file_info {
  flex: none;
  max-width: 128px;
  padding: 0;
  margin: 0 0 0 8px;
}

.download .file_name {
  font-family: "Roboto", sans-serif;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.download .file_size {
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message {
  font-family: "Roboto Light", sans-serif;
  margin: 0;
  padding: 0;
  white-space: pre;
}

.message_center {
  text-align: center;
  white-space: pre;
}

.meta {
  padding: 0;
  margin: 0 4px 0 4px;
  color: white;
  font-family: "Roboto Light", sans-serif;
}
</style>
