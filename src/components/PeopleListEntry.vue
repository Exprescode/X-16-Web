<template>
  <div class="entry" v-on:click="select">
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
  data() {
    return {
      selected: this.$parent.isSelectedUser()
    };
  },
  methods: {
    select() {
      if (this.selected) {
        this.$parent.removeUser(this.user.email);
        this.selected = false;
      } else {
        this.$parent.addUser(this.user.email);
        this.selected = true;
      }
    }
  }
};
</script>

<style>
</style>
