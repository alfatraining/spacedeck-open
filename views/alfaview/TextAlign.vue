<template>
  <div class="dialog avw-dialog">
    <div class="btn-group">
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'left')"
      >
        <i class="material-icons">format_align_left</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'center')"
      >
        <i class="material-icons">format_align_center</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'right')"
      >
        <i class="material-icons">format_align_right</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'justify')"
      >
        <i class="material-icons">format_align_justify</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'top')"
      >
        <i class="material-icons">vertical_align_top</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'middle')"
      >
        <i class="material-icons">vertical_align_center</i>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'bottom')"
      >
        <i class="material-icons">vertical_align_bottom</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    setArtifactStyleProp(axis, position) {
      this.$root.set_artifact_style_prop(axis, position);
    },
  },
};
</script>
