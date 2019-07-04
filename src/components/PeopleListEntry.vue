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
      return this.$parent.isSelectedUser(this.user);
    },
    profile_color: function() {
      var color_index = this.user.id.charCodeAt(this.user.id.length - 1) % 6;
      var colors = [
        "profile_red",
        "profile_orange",
        "profile_green",
        "profile_blue",
        "profile_indigo",
        "profile_violet"
      ];
      return "profile " + colors[color_index];
    }
  },
  methods: {
    select() {
      if (this.selected) {
        this.$parent.removeUser(this.user);
        this.selected = false;
      } else {
        this.$parent.addUser(this.user);
        this.selected = true;
      }
    }
  }
};
</script>

<style>
</style>
