<template>
  <div id="layout" class="dialog avw-dialog">
    <div class="btn-group">
      <button class="btn btn-transparent btn-icon" @click="layoutStackTop()">
        <i class="material-icons">flip_to_front</i>
      </button>
      <button class="btn btn-transparent btn-icon" @click="layoutStackBottom()">
        <i class="material-icons">flip_to_back</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    layoutStackTop() {
      this.$root.layout_stack_top();
    },
    layoutStackBottom() {
      this.$root.layout_stack_bottom();
    },
  },
};
</script>
