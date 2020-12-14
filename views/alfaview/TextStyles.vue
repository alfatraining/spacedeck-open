<template>
  <div class="dialog">
    <div class="btn-group">
      <button
        class="btn btn-transparent btn-icon-labeled"
        @click="applyFormatting($event, 'bold')"
      >
        <span class="icon icon-text-bold"></span>
        <span class="icon-label">Bold</span>
      </button>
      <button
        class="btn btn-transparent btn-icon-labeled"
        @click="applyFormatting($event, 'italic')"
      >
        <span class="icon icon-text-italic"></span>
        <span class="icon-label">Italic</span>
      </button>
      <button
        class="btn btn-transparent btn-icon-labeled"
        @click="applyFormatting($event, 'underline')"
      >
        <span class="icon icon-text-underline"></span>
        <span class="icon-label">Underl.</span>
      </button>
      <button
        class="btn btn-transparent btn-icon-labeled"
        @click="applyFormatting($event, 'strikeThrough')"
      >
        <span class="icon icon-text-strike"></span>
        <span class="icon-label">Strike</span>
      </button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  methods: {
    applyFormatting(style) {
      this.$root.apply_formatting(style);
    },
  },
};
</script>
<style lang="css">
.color-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
