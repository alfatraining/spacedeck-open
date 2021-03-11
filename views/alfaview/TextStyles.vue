<template>
  <div class="dialog">
    <div class="btn-group">
      <button class="btn btn-transparent btn-icon-labeled" @click="applyFormatting($event, 'bold')">
        <i class="material-icons">format_bold</i>
        <span class="icon-label">Bold</span>
      </button>
      <button class="btn btn-transparent btn-icon-labeled" @click="applyFormatting($event, 'italic')">
        <i class="material-icons">format_italic</i>
        <span class="icon-label">Italic</span>
      </button>
      <button class="btn btn-transparent btn-icon-labeled" @click="applyFormatting($event, 'underline')">
        <i class="material-icons">format_underlined</i>
        <span class="icon-label">Underl.</span>
      </button>
      <button class="btn btn-transparent btn-icon-labeled" @click="applyFormatting($event, 'strikeThrough')">
        <i class="material-icons">strikethrough_s</i>
        <span class="icon-label">Strike</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    applyFormatting(event, style) {
      this.$root.apply_formatting(event, style);
    },
  },
};
</script>
