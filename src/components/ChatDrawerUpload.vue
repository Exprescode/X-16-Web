<template>
  <div id="drawer">
    <div id="file_list">
      <FileListEntry v-for="name in upload_queue_names" v-bind:name="name" v-bind:key="name"/>
    </div>
    <div class="menu_option">
      <span id="count">{{upload_queue.length}}</span> Files
    </div>
    <div class="menu_option" v-show="error_msg">
      <span id="error">{{error_msg}}</span>
    </div>
    <input id="file_selector" type="file" v-on:change="selectFile" ref="file_selector" multiple>
    <button class="menu_option clickable" v-on:click="$refs.file_selector.click()">
      <img src="../assets/plus.png">Add Files
    </button>
    <button
      class="menu_option clickable"
      v-on:click="selectDone"
      v-bind:disabled="upload_queue.length < 1"
    >
      <img src="../assets/tick.png">Done
    </button>
    <button class="menu_option clickable" v-on:click="selectCancel">
      <img src="../assets/cross_2.png">Cancel
    </button>
  </div>
</template>

<script>
import FileListEntry from "@/components/FileListEntry.vue";
import { UPLOAD_FILES, SEND_MESSAGE } from "@/graphql";
export default {
  name: "ChatDrawerUpload",
  components: {
    FileListEntry
  },
  mounted() {
    this.enqueue_upload(this.$parent.upload_queue_buffer);
    this.$parent.upload_queue_buffer = [];
  },
  data() {
    return {
      error_msg: "",
      upload_queue: [],
      upload_queue_names: []
    };
  },
  methods: {
    enqueue_upload(files) {
      for (var i = 0; i < files.length; ++i) {
        if (!this.upload_queue_names.includes(files[i].name)) {
          this.upload_queue.push(files[i]);
          this.upload_queue_names.push(files[i].name);
        }
      }
    },
    remove_upload(name) {
      var index = this.upload_queue_names.indexOf(name);
      if (index > -1) {
        this.upload_queue.splice(index, 1);
        this.upload_queue_names.splice(index, 1);
      }
    },
    selectFile() {
      // eslint-disable-next-line
      console.log(this.$refs.file_selector.files);
      this.enqueue_upload(this.$refs.file_selector.files);
    },
    selectDone() {
      const context = this;
      const individual_chat_id =
        this.$parent.active_chat.__typename === "IndividualChat"
          ? this.$parent.active_chat.id
          : "";
      const group_chat_id =
        this.$parent.active_chat.__typename === "GroupChat"
          ? this.$parent.active_chat.id
          : "";
      while (context.upload_queue.length > 0) {
        var file = context.upload_queue.shift();
        var reader = new FileReader();
        reader.onload = (function() {
          return function(e) {
            var raw = e.target.result;
            var rawBytes = new Uint8Array(raw);
            var hex = [];
            for (var cycle = 0; cycle < raw.byteLength; cycle++) {
              hex.push(rawBytes[cycle]);
            }
            context.$apollo
              .mutate({
                mutation: UPLOAD_FILES,
                variables: {
                  content: hex,
                  filename: file.name,
                  filesize: file.size,
                  individualChatId: individual_chat_id,
                  groupChatId: group_chat_id,
                  token: context.$parent.session_token
                }
              })
              .then(data => {
                // eslint-disable-next-line
                console.log(data);
                var msg =
                  '{"download":{"id": "' +
                  data.data.UploadFiles.id +
                  '", "name": "' +
                  data.data.UploadFiles.filename +
                  '", "size": "' +
                  data.data.UploadFiles.filesize +
                  '"}}';
                context.sendMessage(
                  context,
                  msg,
                  individual_chat_id,
                  group_chat_id
                );
              })
              .catch(error => {
                // eslint-disable-next-line
                console.log(error);
                context.sendMessage(
                  context,
                  "File upload failed! (" + file.name + ")",
                  individual_chat_id,
                  group_chat_id
                );
              });
          };
        })(file);
        reader.readAsArrayBuffer(file);
      }
      this.$parent.resetLeftPanelActiveComponent();
    },
    selectCancel() {
      this.$parent.removeLeftPanelActiveComponent();
    },
    sendMessage(context, message, individual_chat_id, group_chat_id) {
      this.$apollo
        .mutate({
          mutation: SEND_MESSAGE,
          variables: {
            sender: context.$parent.master_email,
            message: message,
            individualChatId: individual_chat_id,
            groupChatId: group_chat_id,
            token: context.$parent.session_token
          }
        })
        .then(data => {
          // eslint-disable-next-line
          console.log(data);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
button,
input {
  border-style: none;
  background-color: transparent;
}

button:disabled {
  cursor: not-allowed;
}

#drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

#file_list {
  flex: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-y: auto;
}

#file_selector {
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.clickable:hover {
  background-color: #f5faff;
}

.menu_option {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 16px;
  flex: none;
}

.menu_option img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

.menu_option #count {
  font-family: "Roboto Medium", sans-serif;
  color: #3c95ff;
  font-size: 24px;
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  text-align: center;
}

.menu_option #error {
  color: red;
}

#search {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  flex: none;
}

#textbox {
  width: 100%;
  background-color: #f0f7ff;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}

#textbox input {
  width: 100%;
  padding: 0;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 16px;
}

#textbox button {
  margin: 0 0 0 8px;
  padding: 0;
  height: 12px;
  width: 12px;
}

#textbox button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#name {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

#name div {
  color: #404040;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  padding: 0 0 0 6px;
  margin: 0 0 4px 0;
}

#name input {
  margin: 0 0 8px 0;
  padding: 6px 8px 6px 8px;
  border-style: none;
  border-radius: 8px;
  color: #404040;
  font-family: "Roboto Light", sans-serif;
  font-size: 16px;
  background-color: #f0f7ff;
  width: 100%;
  box-sizing: border-box;
}
</style>
