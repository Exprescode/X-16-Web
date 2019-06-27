<template>
  <div class="entry" v-on:click="selected">
    <div class="profile profile_red">{{initial}}</div>
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
    }
  },
  methods: {
    selected() {
      this.$parent.selectUser(this.user.email);
    }
  }
};
</script>

<style>
</style>
