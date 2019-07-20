<template>
  <div id="drawer">
    <button v-on:click="selectNewChat">
      <img src="../assets/plus.png">New Chat
    </button>
    <button v-on:click="selectAccount">
      <img src="../assets/user.png">Account
    </button>
    <button v-on:click="selectLogout">
      <img src="../assets/door.png">Logout
    </button>
    <button v-on:click="selectClose">
      <img src="../assets/cross_2.png">Close
    </button>
  </div>
</template>

<script>
export default {
  name: "DrawerMenu",
  methods: {
    selectClose() {
      this.$parent.removeLeftPanelActiveComponent();
    },
    selectLogout() {
      this.$parent.logoutUser();
    },
    selectAccount() {
      this.$parent.addLeftPanelActiveComponent("DrawerAccount");
    },
    selectNewChat() {
      this.$parent.addLeftPanelActiveComponent("DrawerNewChat");
    }
  }
};
</script>

<style scoped>
button {
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
  font-size: 16px;
}

button:hover {
  background-color: #f5faff;
}

img {
  padding: 0;
  margin: 0 16px 0 0;
  width: 20px;
  height: 20px;
}

#drawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
