<template>
  <div v-if="activeSpaceLoaded" class="avw-board-navigation">
    <div
      v-if="activeSpace"
      class="avw-minimap"
      :style="{
        width: '' + activeSpace.width / minimapScale + 'px',
        height: '' + activeSpace.height / minimapScale + 'px',
      }"
      @mousedown="handleMinimapMousedown($event)"
      @touchstart="handleMinimapMousedown($event)"
      @mousemove="handleMinimapMousemove($event)"
      @touchmove="handleMinimapMousemove($event)"
      @mouseleave="handleMinimapMouseup($event)"
      @touchend="handleMinimapMouseup($event)"
      @mouseup="handleMinimapMouseup($event)"
    >
      <div
        v-for="a in activeSpaceArtifacts"
        :style="{
          left: '' + a.x / minimapScale + 'px',
          top: '' + a.y / minimapScale + 'px',
          width: '' + a.w / minimapScale + 'px',
          height: '' + a.h / minimapScale + 'px',
        }"
      ></div>
      <div
        class="window"
        :style="{
          left: '' + scrollLeft / minimapScale + 'px',
          top: '' + scrollTop / minimapScale + 'px',
          width: '' + windowWidth / minimapScale + 'px',
          height: '' + windowHeight / minimapScale + 'px',
        }"
      ></div>
    </div>
    <div class="btn-group light avw-zoom-bar">
      <button class="btn btn-icon btn-md avw-button" @click="zoomOut()">
        <span class="icon icon-minus"></span>
      </button>
      <button class="btn btn-md avw-button no-p" @click="zoomToOriginal()">
        {{ viewportZoomPercent }}%
      </button>
      <button class="btn btn-icon btn-md avw-button" @click="zoomIn()">
        <span class="icon icon-plus"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    activeSpaceLoaded() {
      return this.$root.active_space_loaded;
    },
    viewportZoomPercent() {
      return this.$root.viewport_zoom_percent;
    },
    activeSpace() {
      return this.$root.active_space;
    },
    activeSpaceArtifacts() {
      return this.$root.active_space_artifacts;
    },
    minimapScale() {
      return this.$root.minimap_scale;
    },
    scrollLeft() {
      return this.$root.scroll_left;
    },
    scrollTop() {
      return this.$root.scroll_top;
    },
    windowWidth() {
      return this.$root.window_width;
    },
    windowHeight() {
      return this.$root.window_height;
    },
  },
  methods: {
    zoomIn() {
      this.$root.zoom_in();
    },
    zoomOut() {
      this.$root.zoom_out();
    },
    zoomToOriginal() {
      this.$root.zoom_to_original();
    },
    handleMinimapMousedown(event) {
      this.$root.handle_minimap_mousedown(event);
    },
    handleMinimapMousemove(event) {
      this.$root.handle_minimap_mousemove(event);
    },
    handleMinimapMouseup(event) {
      this.$root.handle_minimap_mouseup(event);
    },
  },
};
</script>

<style lang="css">
.avw-board-navigation {
  display: flex;
  flex-direction: column;
  bottom: 30px;
  right: 30px;
  position: absolute;
}
.avw-zoom-bar {
  display: flex;
  z-index: 3500;
  box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.15);
  border: 1px solid black;
  background-color: #37383b;
  margin-top: 8px;
}
.avw-minimap {
  background-color: transparent;
  z-index: 20000;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.avw-minimap div {
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  pointer-events: none;
}
.avw-minimap div.window {
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
