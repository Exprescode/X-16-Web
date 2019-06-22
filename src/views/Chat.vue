<template>
  <div id="container">
    <div id="left_panel">
      <div id="chat_list">
        <ChatListEntry
          v-for="entry in chat_list"
          v-bind:chat_list_entry="entry"
          v-bind:key="entry.id"
        />
      </div>
      <div id="toolbar">
        <button class="menu">
          <img src="../assets/menu.png">
        </button>
        <div class="search">
          <input type="text" placeholder="Search">
          <button>
            <img src="../assets/cross.png">
          </button>
        </div>
      </div>
      <!-- <div id="drawer">
            <button><img src="../assets/cross_2.png">Close</button>
            <button><img src="../assets/door.png">Logout</button>
            <button><img src="../assets/gear.png">Settings</button>
            <button><img src="../assets/plus.png">New Chat</button>
      </div>-->
      <!-- <div id="drawer_new_chat">
            <div id="people_list">
                <div class="entry">
                    <div class="profile profile_red">H</div>
                    <div class="content">
                        <div class="name">Henry</div>
                        <div class="email">henry@sample.com</div>
                    </div>
                </div>
            </div>
            <div id="search"><input type="text" placeholder="Search"><button><img src="../assets/cross.png"></button></div>
            <div id="counter"><span>0</span> Selected</div>
            <button><img src="../assets/plus.png">Create</button>
            <button><img src="../assets/cross_2.png">Cancel</button>
      </div>-->
      <!-- <div id="drawer_settings">
            <div id="people_list">
                <div class="entry">
                    <div class="profile profile_red">H</div>
                    <div class="content">
                        <div class="name">Henry</div>
                        <div class="email">henry@sample.com</div>
                    </div>
                </div>
            </div>
            <div id="group_name">
                <div id="label">Chat Name</div>
                <input type="text" value="New Group">
            </div>
            <div id="user">
                <div id="profile">
                    <div class="profile_blue" id="preview">S</div>
                    <button>EDIT</button>
                </div>
                <div id="identity">
                    <div id="name">
                        <div class="label">Name</div>
                        <input type="text" value="Sam">
                    </div>
                    <div id="password">
                        <div class="label">Password</div>
                        <input type="password" placeholder="New Password">
                    </div>
                </div>
            </div>
            <button class="tick_cross"><img src="../assets/tick.png">Done</button>
            <button class="tick_cross"><img src="../assets/cross_2.png">Cancel</button>
      </div>-->
    </div>
    <div id="right_panel">
      <div id="header">Henry</div>
      <div id="chat">
        <div id="entry">
          <div class="bubble">
            <div class="author">Henry</div>
            <div class="message">hi</div>
          </div>
          <div class="meta">
            <div class="status">Delivered</div>
            <div class="timestamp">23.05.2019 18:14</div>
          </div>
        </div>
        <!-- <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
            </div>
            <div class="entry">
                <div class="bubble">
                    <div class="author">Henry</div>
                    <div class="message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eleifend luctus
                        mollis. Pellentesque convallis quam at finibus maximus. Integer nisl sapien, pretium id diam
                        vitae, congue sagittis neque. Curabitur vestibulum, nisi vel tristique viverra, eros libero
                        fringilla lacus, vitae dictum tortor sapien nec sem. Vestibulum finibus bibendum mi, ac viverra
                        massa finibus sit amet. Aliquam dapibus finibus convallis. Integer sit amet lacinia enim. Morbi
                        tincidunt pharetra scelerisque. Curabitur imperdiet, sapien non malesuada rhoncus, metus lacus
                        blandit lorem, a vulputate dolor sapien pellentesque erat. Etiam euismod rutrum elementum.
                        Donec aliquet elementum elit, ac pellentesque purus interdum in. Sed quis mi mauris. Sed at
                        tempus urna. Quisque tristique dapibus est id dictum.</div>
                </div>
                <div class="meta">
                    <div class="status">Delivered</div>
                    <div class="timestamp">23.05.2019 18:14</div>
                </div>
        </div>-->
      </div>
      <div id="compose">
        <div id="textbox">
          <input type="text" placeholder="Compose message here.">
          <button>
            <img src="../assets/cross.png">
          </button>
        </div>
        <button id="search">
          <img src="../assets/magnifying_glass.png">
        </button>
        <button id="send">SEND</button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatListEntry from "@/components/ChatListEntry.vue";
import {
  CHATS_QUERY,
  SEND_MESSAGE_MUTATION,
  MESSAGE_SENT_SUBSCRIPTION
} from "@/graphql";
export default {
  name: "Chat",
  components: {
    ChatListEntry
  },
  data() {
    return {
      chat_list: [
        {
          id: "000000",
          name: "Tom",
          msg: "Dinner tonight??..........................................",
          count: 1,
          group: false
        },
        {
          id: "000001",
          name: "Henry",
          msg:
            "Dinner tonight?.........................................................",
          count: 0,
          group: false
        },
        {
          id: "000002",
          name: "Jodi",
          msg: "Dinner tonight?",
          count: 0,
          group: false
        },
        {
          id: "000003",
          name: "Joyce",
          msg: "Dinner tonight?",
          count: 0,
          group: false
        },
        {
          id: "000004",
          name: "Raid Party",
          msg: "Dinner tonight?",
          count: 0,
          group: true
        }
      ]
    };
  },
  apollo: {
    chats: {
      query: CHATS_QUERY,
      subscribeToMore: {
        document: MESSAGE_SENT_SUBSCRIPTION,
        updateQuery: (previousData, { subscriptionData }) => {
          return {
            chats: [...previousData.chats, subscriptionData.data.messageSent]
          };
        }
      }
    }
  },
  methods: {
    async sendMessage() {
      const message = this.message;
      this.message = "";

      await this.$apollo.mutate({
        mutation: SEND_MESSAGE_MUTATION,
        variables: {
          from: this.username,
          message
        }
      });
    }
  }
};
</script>

<style>
#container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
}

#left_panel {
  width: 256px;
  height: 100%;
  background-color: white;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
  flex: none;
}

#left_panel #chat_list {
  background-color: transparent;
  flex: auto;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  z-index: 1;
}

#left_panel #chat_list .entry {
  background-color: transparent;

  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
}

#left_panel #chat_list .entry:hover {
  background-color: #f5faff;
}

#left_panel #chat_list .entry .profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  font-family: "Roboto Medium", sans-serif;
  font-size: 20px;
  color: white;
  flex: none;
}

.profile_purple {
  background-color: #a800ff;
}

.profile_blue {
  background-color: #0079ff;
}

.profile_green {
  background-color: #00f11d;
}

.profile_orange {
  background-color: #ff7f00;
}

.profile_red {
  background-color: #ff0900;
}

#left_panel #chat_list .entry .content {
  width: 100%;
  margin: 0 0 0 8px;
  padding: 0;
  min-width: 0;
}

#left_panel #chat_list .entry .content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#left_panel #chat_list .entry .content .message {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#left_panel #chat_list .entry .counter {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  min-width: 21px;
  background-color: transparent;
  margin: 0 0 0 8px;
}

#left_panel #chat_list .entry .counter .badge {
  font-size: 14px;
  font-family: "Roboto Medium", sans-serif;
  color: white;
  height: 1.5em;
  min-width: 1.5em;
  box-sizing: border-box;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5em;
  border-radius: 0.75em;
  background-color: #3c95ff;
}

#left_panel #toolbar {
  min-width: 5%;
  width: 100%;
  background-color: transparent;
  padding: 8px 12px 8px 12px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex: none;
  z-index: 1;
}

#left_panel #toolbar button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#left_panel #toolbar .menu {
  width: 20px;
  height: 20px;
  padding: 0;
  border-style: none;
  background-color: transparent;
}

#left_panel #toolbar .search {
  min-width: 5%;
  margin: 0 0 0 12px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex: auto;
}

#left_panel #toolbar .search input {
  min-width: 5%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
  flex: auto;
}

#left_panel #toolbar .search button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#drawer {
  position: fixed;
  bottom: 0;
  z-index: 2;
  width: 256px;
  height: 100%;
  background-color: transparent;
  display: flex;
  flex-flow: column-reverse;
}

#drawer button {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  border-style: none;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 14px;
}

#drawer button:hover {
  background-color: #f5faff;
}

#drawer button img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer_new_chat {
  z-index: 3;
  position: fixed;
  bottom: 0;
  width: 256px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}

#drawer_new_chat button,
#drawer_new_chat #counter {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  border-style: none;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 14px;
}

#drawer_new_chat button:hover {
  background-color: #f5faff;
}

#drawer_new_chat button img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer_new_chat #counter span {
  font-family: "Roboto Medium", sans-serif;
  color: #3c95ff;
  font-size: 24px;
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  text-align: center;
}

#drawer_new_chat #search {
  width: 240px;
  margin: 4px 8px 8px 8px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#drawer_new_chat #search input {
  width: 100%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
}

#drawer_new_chat #search button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#drawer_new_chat #search button img {
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
}

#drawer_new_chat #people_list,
#drawer_settings #people_list {
  width: 100%;
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: transparent;
  overflow-y: auto;
}

#drawer_new_chat #people_list .entry,
#drawer_settings #people_list .entry {
  background-color: transparent;
  width: 100%;
  max-width: 256px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  flex: none;
}

#drawer_new_chat #people_list .entry:hover,
#drawer_settings #people_list .entry:hover {
  background-color: #f5faff;
}

#drawer_new_chat #people_list .entry .profile,
#drawer_settings #people_list .entry .profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  font-family: "Roboto Medium", sans-serif;
  font-size: 20px;
  color: white;
  flex: none;
}

#drawer_new_chat #people_list .entry .content,
#drawer_settings #people_list .entry .content {
  margin: 0 0 0 8px;
  padding: 0;
  min-width: 0;
}

#drawer_new_chat #people_list .entry .content .name,
#drawer_settings #people_list .entry .content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#drawer_new_chat #people_list .entry .content .email,
#drawer_settings #people_list .entry .content .email {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#drawer_settings {
  z-index: 4;
  position: fixed;
  bottom: 0;
  width: 256px;
  height: 100%;
  background-color: white;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}

#drawer_settings #group_name {
  background-color: transparent;
  box-sizing: border-box;
  padding: 8px 8px 4px 8px;
  margin: 0px;
}

#drawer_settings #group_name input {
}

#drawer_settings #user {
  background-color: transparent;
  display: flex;
  flex-flow: row nowrap;
  box-sizing: border-box;
  padding: 8px;
}

#drawer_settings #user #profile {
  flex: none;
}

#drawer_settings #user #profile #preview {
  padding: 0;
  margin: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-family: "Roboto Medium", sans-serif;
  font-size: 24px;
}

#drawer_settings #user #profile button {
  padding: 0;
  margin: 4px 0 0 0;
  width: 50px;
  padding: 3px;
  border-radius: 25px;
  box-sizing: border-box;
  border-style: none;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  background-color: #3c95ff;
}

#drawer_settings #user #profile button:hover {
  background-color: #3c95ffe5;
}

#drawer_settings #user #identity {
  margin: 0 0 0 12px;
  padding: 0;
}

#drawer_settings #user #identity #name {
}

#drawer_settings #user #identity #password {
  padding: 0;
  margin: 8px 0 0 0;
}

#drawer_settings .label {
  color: #404040;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  padding: 0 0 0 6px;
  margin: 0 0 4px 0;
}

#drawer_settings input {
  margin: 0;
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

#drawer_settings .tick_cross {
  width: 100%;
  padding: 12px 16px 12px 16px;
  margin: 0;
  box-sizing: border-box;
  border-style: none;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 14px;
}

#drawer_settings .tick_cross:hover {
  background-color: #f5faff;
}

#drawer_settings .tick_cross img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#right_panel {
  padding: 0;
  margin: 0;
  flex: auto;
  background-color: transparent;
  display: flex;
  flex-flow: column nowrap;
}

#right_panel #header {
  background-color: white;
  width: 100%;
  padding: 16px;
  vertical-align: middle;
  box-sizing: border-box;
  border-left-style: solid;
  border-left-color: #71b1ff;
  border-left-width: 1px;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  color: #000000bf;
  box-shadow: 0 1px 10px #00000019;
  z-index: 2;
}

#right_panel #chat {
  width: 100%;
  flex: auto;
  box-sizing: border-box;
  z-index: 1;
  padding: 8px 0 0px 0;
  overflow-y: auto;
}

#right_panel #chat #entry {
  margin: 0;
  padding: 0;
  background-color: transparent;
  padding: 0px 8px 8px 8px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
}

#right_panel #chat #entry .bubble {
  background-color: white;
  border-radius: 8px;
  padding: 8px 12px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

#right_panel #chat #entry .author {
  font-family: "Roboto", sans-serif;
  color: #404040;
  margin: 0;
  padding: 0 0 4px 0;
}

#right_panel #chat #entry .message {
  font-family: "Roboto Light", sans-serif;
  color: #404040;
  margin: 0;
  padding: 0;
}

#right_panel #chat #entry .meta {
  padding: 0;
  margin: 0 0 0 4px;
  color: white;
  font-family: "Roboto Light", sans-serif;
}

#right_panel #compose {
  width: 100%;
  background-color: white;
  padding: 8px 12px 8px 12px;
  margin: 0px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  border-left-style: solid;
  border-left-color: #71b1ff;
  border-left-width: 1px;
  align-items: center;
  box-shadow: 0 -1px 10px #00000019;
  z-index: 2;
}

#right_panel #compose #textbox {
  min-width: 256px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #f0f7ff;
  display: flex;
  flex: auto;
  align-items: center;
}

#right_panel #compose #textbox input {
  min-width: 1%;
  padding: 0;
  border-style: none;
  font-family: "Roboto Light", sans-serif;
  color: #000000bf;
  font-size: 12px;
  background-color: transparent;
  flex: auto;
}

#right_panel #compose #textbox button {
  margin: 0 0 0 8px;
  padding: 0;
  border-style: none;
  background-color: transparent;
  height: 12px;
  width: 12px;
}

#right_panel #compose #textbox img {
  width: 100%;
  height: auto;
  padding: 0;
  margin: 0;
}

#right_panel #compose #search {
  width: 28px;
  height: 28px;
  padding: 7px;
  margin: 0 0 0 8px;
  border-style: none;
  background-color: #3c95ff;
  border-radius: 50%;
  box-sizing: border-box;
}

#right_panel #compose #search img {
  width: 100%;
  height: auto;
}

#right_panel #compose #send {
  border-style: none;
  background-color: #3c95ff;
  border-radius: 14px;
  height: 28px;
  font-family: "Roboto Light", sans-serif;
  color: white;
  text-align: center;
  padding: 4px 8px 4px 8px;
  box-sizing: border-box;
  margin: 0 0 0 8px;
}

#right_panel #compose #search:hover,
#right_panel #compose #send:hover {
  background-color: #3c95ffe5;
}
</style>
