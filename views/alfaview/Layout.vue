<template>
  <div id="layout" class="dialog">
    <div class="btn-group">
      <button class="btn btn-transparent btn-icon" @click="layoutStackTop()">
        <span class="icon icon-stack-3d-top"></span>
      </button>
      <button class="btn btn-transparent btn-icon" @click="layoutStackBottom()">
        <span class="icon icon-stack-3d-bottom"></span>
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
