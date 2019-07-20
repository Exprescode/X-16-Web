<template>
  <div class="entry" v-on:click="select">
    <div v-bind:class="profile_color">
      <span v-show="!selected">{{initial}}</span>
      <img src="../assets/tick_white.png" v-show="selected">
    </div>
    <div class="content">
      <div class="name">{{user.name}}</div>
      <div class="email">{{user.email}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PeopleListEntry",
  props: ["user"],
  computed: {
    initial: function() {
      return this.user.name.charAt(0).toUpperCase();
    },
    selected: function() {
      return this.$parent.indexOfSelectedUser(this.user) >= 0;
    },
    profile_color: function() {
      var color = "";
      switch (this.user.id.charCodeAt(this.user.id.length - 1) % 6) {
        case 0:
          color = "profile_red";
          break;
        case 1:
          color = "profile_orange";
          break;
        case 2:
          color = "profile_green";
          break;
        case 3:
          color = "profile_blue";
          break;
        case 4:
          color = "profile_indigo";
          break;
        case 5:
          color = "profile_violet";
          break;
      }
      return "profile " + color;
    }
  },
  methods: {
    select() {
      if (this.selected) {
        this.$parent.deselectUser(this.user);
      } else {
        this.$parent.selectUser(this.user);
      }
    }
  }
};
</script>

<style scoped>
.entry {
  flex: none;
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  display: flex;
  flex-direction: row;
}

.entry:hover {
  background-color: #f5faff;
}

.profile {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile img {
  width: 50%;
  height: 50%;
}

.content {
  flex: auto;
  margin: 0 0 0 8px;
  padding: 0;
}

.content .name {
  font-family: "Roboto Medium", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.content .email {
  font-family: "Roboto Light", sans-serif;
  color: #999999;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.profile_violet {
  background-color: #9400d3;
}

.profile_indigo {
  background-color: #4b0082;
}

.profile_blue {
  background-color: #0000ff;
}

.profile_green {
  background-color: #00ff00;
}

.profile_orange {
  background-color: #ff7f00;
}

.profile_red {
  background-color: #ff0000;
}
</style>
