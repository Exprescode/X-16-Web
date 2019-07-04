<template>
  <div class="entry" v-on:click="select">
    <div class="profile profile_red">
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
