<template>
  <div class="entry" v-on:click="select">{{name}}</div>
</template>

<script>
export default {
  name: "PeopleListEntry",
  props: ["name"],
  computed: {},
  methods: {
    select() {
      this.$parent.remove_upload(this.name);
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
  font-family: "Roboto", sans-serif;
  color: #404040;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.entry:hover {
  background-color: #ff7f7f;
  cursor: pointer;
}
</style>
