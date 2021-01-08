<template>
  <div>
    <div
      v-if="backgroundMode === 'color' && colorMode == 'palette'"
      class="color-wrap color-palette"
    >
      <div
        v-for="(index, _) in swatches"
        :key="index"
        class="adapt overflow-y-scroll"
      >
        <button
          class="btn btn-round btn-darken"
          :style="{ 'background-color': swatches[index].hex }"
          @click="applySwatchColor(swatches[index])"
        >
          <span class="icon"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backgroundMode: this.$root.background_mode || "color",
      swatches: this.$root.swatches,
      colorMode: this.$root.color_mode,
      activeSpace: this.$root.active_space,
      spaceBackgroundUploading: this.$root.space_background_uploading,
    };
  },
  methods: {
    selectBackgroundMode(mode) {
      this.backgroundMode = mode;
    },
    applySwatchColor(swatche) {
      this.$root.apply_swatch_color(swatche);
      this.$root.opened_dialog = "none";
    },
    handleSectionBackgroundUpload(event) {
      this.$root.handle_section_background_upload(event);
    },
    removeSectionBackground() {
      this.$root.remove_section_background;
    },
    handleTouchSelectBackgroundImage() {
      this.$root.handle_touch_select_background_image();
    },
  },
};
</script>
