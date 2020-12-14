<template>
  <div>
    <div>
      <button @click="selectBackgroundMode('image')"><span>Image</span></button>
      <button @click="selectBackgroundMode('color')"><span>Color</span></button>
    </div>

    <div v-if="backgroundMode === 'image'">
      <div v-show="backgroundMode == 'image'" v-if="activeSpace" class="">
        <div
          v-if="activeSpace.background_uri && !spaceBackgroundUploading"
          class="background-image"
          :style="{
            height: '233px',
            width: '233px',
            'background-image': 'url(' + activeSpace.background_uri + ')',
            margin: '6px',
            'border-radius': '3px',
          }"
        ></div>

        <div v-if="spaceBackgroundUploading" class="progress state-processing">
          <div class="spinner"></div>
        </div>

        <div
          v-if="!activeSpace.background_uri && !spaceBackgroundUploading"
          class="dialog-section no-b adapt"
          @touchstart="handleTouchSelectBackgroundImage()"
        >
          <label class="btn btn-sm btn-transparent btn-icon">
            <span class="icon icon-picture-upload"></span>
            <input
              id="background-uploader"
              type="file"
              accept="image/*"
              @change="handleSectionBackgroundUpload($event)"
            />
          </label>
          <p>Click to upload a background image</p>
        </div>

        <div
          v-if="activeSpace.background_uri"
          class="dialog-section no-p no-flex"
        >
          <div class="btn-cluster">
            <label
              v-if="activeSpace.background_uri"
              class="btn btn-transparent btn-block text-center"
              @touchstart="handleTouchSelectBackgroundImage()"
            >
              <input
                id="background-uploader"
                type="file"
                accept="image/*"
                @chang="handleSectionBackgroundUpload($event)"
              />
              <span class="icon icon-picture-upload"></span>
              <!-- Upload -->
            </label>
            <button
              class="btn btn-transparent text-center"
              @click="removeSectionBackground()"
            >
              Remove
              <span class="icon icon-trash"></span>
              <!-- Remove -->
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="backgroundMode === 'color'">
      <div v-if="colorMode == 'palette'" class="color-wrap color-palette">
        <div
          v-for="(index, value) in swatches"
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
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      backgroundMode: this.$root.background_mode,
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

<style lang="css">
.color-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
