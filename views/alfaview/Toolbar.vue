<template>
  <div>
    <button class="av-button" @click="openDialog('shapes')">Shapes</button>
  </div>
</template>

<script>
export default {
  created() {},
  methods: {
    openDialog(param) {
      this.$root.open_dialog(param);
    },
  },
};
</script>

<style lang="css">
.av-button {
  display: block;
  border-radius: 28px;
  height: 32px;
  line-height: 32px;
  min-width: 95px;
  font-size: 14px;
  margin: 6px 12px;
  background: rgba(195, 196, 198, 0.4);
  color: rgba(17, 17, 46, 0.7);
  text-decoration: none;
}
</style>
