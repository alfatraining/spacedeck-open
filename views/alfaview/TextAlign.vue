<template>
  <div class="dialog">
    <div class="btn-group">
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'left')"
      >
        <span class="icon icon-text-align-left-alt"></span>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'center')"
      >
        <span class="icon icon-text-align-center-alt"></span>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'right')"
      >
        <span class="icon icon-text-align-right-alt"></span>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('align', 'justify')"
      >
        <span class="icon icon-text-align-justify-alt"></span>
      </button>

      <button class="btn btn-divider"></button>

      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'top')"
      >
        <span class="icon icon-align-vertical-top"></span>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'middle')"
      >
        <span class="icon icon-align-vertical-middle"></span>
      </button>
      <button
        class="btn btn-transparent btn-icon"
        @click="setArtifactStyleProp('valign', 'bottom')"
      >
        <span class="icon icon-align-vertical-bottom"></span>
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
<style lang="css">
.color-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
