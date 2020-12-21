<template>
  <div id="layout" class="dialog">
    <div class="dialog-section">
      <div class="btn-group">
        <button class="btn btn-transparent btn-icon" @click="layoutStackTop()">
          <span class="icon icon-stack-3d-top"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutStackBottom()"
        >
          <span class="icon icon-stack-3d-bottom"></span>
        </button>
        <button
          class="left btn btn-transparent btn-icon"
          @click="layoutAlignLeft()"
        >
          <span class="icon icon-align-left"></span>
        </button>
        <button
          class="right btn btn-transparent btn-icon"
          @click="layoutAlignRight()"
        >
          <span class="icon icon-align-right"></span>
        </button>
        <button
          class="top btn btn-transparent btn-icon"
          @click="layoutAlignTop()"
        >
          <span class="icon icon-align-top"></span>
        </button>
        <button
          class="bottom btn btn-transparent btn-icon"
          @click="layoutAlignBottom()"
        >
          <span class="icon icon-align-bottom"></span>
        </button>
      </div>
      <div class="btn-group">
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutAlignCenter()"
        >
          <span class="icon icon-align-center-horizontal"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutAlignMiddle()"
        >
          <span class="icon icon-align-center-vertical"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutDistributeHorizontal()"
        >
          <span class="icon icon-distribute-horizontal"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutDistributeVertical()"
        >
          <span class="icon icon-distribute-vertical"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutDistributeHorizontalSpacing()"
        >
          <span class="icon icon-spacing-horizontal"></span>
        </button>
        <button
          class="btn btn-transparent btn-icon"
          @click="layoutDistributeVerticalSpacing()"
        >
          <span class="icon icon-spacing-vertical"></span>
        </button>
        <button class="btn btn-transparent btn-icon" @click="layoutAuto()">
          <span class="icon icon-cluster"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    setArtifactStyleProp(axis, position) {
      this.$root.set_artifact_style_prop(axis, position);
    },
    layoutStackTop() {
      this.$root.layout_stack_top();
    },
    layoutStackBottom() {
      this.$root.layout_stack_bottom();
    },
    layoutAlignLeft() {
      this.$root.layout_align_left();
    },
    layoutAlignRight() {
      this.$root.layout_align_right();
    },
    layoutAlignTop() {
      this.$root.layout_align_top();
    },
    layoutAlignBottom() {
      this.$root.layout_align_bottom();
    },
    layoutAlignCenter() {
      this.$root.layout_align_center();
    },
    layoutAlignMiddle() {
      this.$root.layout_align_middle();
    },
    layoutDistributeHorizontal() {
      this.$root.layout_distribute_horizontal();
    },
    layoutDistributeVertical() {
      this.$root.layout_distribute_vertical();
    },
    layoutDistributeHorizontalSpacing() {
      this.$root.layout_distribute_horizontal_spacing();
    },
    layoutDistributeVerticalSpacing() {
      this.$root.layout_distribute_vertical_spacing();
    },
    layoutAuto() {
      this.$root.layout_auto();
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
