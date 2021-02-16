<template>
  <div class="avw-main-toolbar">
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'pointer' }"
      @click="enableSelectMode"
    >
      <i class="material-icons">crop_free</i>
      <span class="icon-label">{{ $t("toolbar.select") }}</span>
    </button>
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'scribble' }"
      @click="startDrawingScribble"
    >
      <i class="material-icons">gesture</i>
      <span class="icon-label">{{ $t("toolbar.draw") }}</span>
    </button>
    <div class="avw-submenu-wrapper">
      <button
        class="btn btn-icon-labeled avw-button"
        :class="{ open: openedDialog == 'shapes' }"
        @click="openDialog('shapes')"
      >
        <i class="material-icons">category</i>
        <span class="icon-label">{{ $t("toolbar.shape") }}</span>
      </button>
      <Shapes v-if="openedDialog == 'shapes'" class="avw-submenu"></Shapes>
    </div>
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'arrow' }"
      @click="startDrawingArrow"
    >
      <i class="material-icons">sync_alt</i>
      <span class="icon-label">{{ $t("toolbar.arrow") }}</span>
    </button>
    <!-- Disable file uploads for MVP -->
    <!-- <button class="btn btn-icon-labeled avw-button" @click="showFileUploadDialog()">Media</button>
    <input
      v-el:file-upload
      type="file"
      accept="*/*"
      multiple
      style="display: none"
      @change="handleFileUpload($event)"
    /> -->
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'note' }"
      @click="activateTool('note')"
    >
      <i class="material-icons">text_fields</i>
      <span class="icon-label">{{ $t("toolbar.text") }}</span>
    </button>
    <div class="avw-submenu-wrapper">
      <button
        class="btn btn-icon-labeled avw-button"
        :class="{ open: openedDialog == 'background' }"
        @click="openDialog('background')"
      >
        <i class="material-icons">wallpaper</i>
        <span class="icon-label">{{ $t("toolbar.background") }}</span>
      </button>
      <Background
        v-if="openedDialog == 'background'"
        class="avw-submenu"
      ></Background>
    </div>
    <button class="btn btn-icon-labeled avw-button" @click="downloadSpace()">
      <i class="material-icons">file_download</i>
      <span class="icon-label">{{ $t("toolbar.download") }}</span>
    </button>
    <button class="btn btn-icon-labeled avw-button" @click="clearSpace()">
      <!-- <span class="icon icon-page-horizontal-remove"></span> -->
      <i class="material-icons">delete_sweep</i>
      <span class="icon-label">Clear</span>
    </button>
  </div>
</template>

<script>
import { downloadSpace } from "./utils";

export default {
  computed: {
    openedDialog() {
      return this.$root.opened_dialog;
    },
    activeTool() {
      return this.$root.active_tool;
    },
  },
  methods: {
    openDialog(dialog) {
      this.$root.active_tool = "";
      this.$root.open_dialog(dialog);
    },
    startDrawingScribble() {
      this.$root.active_style.stroke = this.$root.active_style.stroke || 4;
      this.$root.start_drawing_scribble();
    },
    startDrawingArrow() {
      this.$root.active_style.stroke = 14;
      this.$root.start_drawing_arrow();
    },
    // showFileUploadDialog() {
    //   this.$els.fileUpload.click();
    // },
    // handleFileUpload(e) {
    //   this.$root.handle_generic_file_upload(e);
    // },
    activateTool(param) {
      this.$root.active_tool = `${param}`;
      this.$root.opened_dialog = "none";
    },
    enableSelectMode() {
      this.$root.active_tool = "pointer";
    },
    downloadSpace() {
      const spaceWidth = this.$root.active_space.width;
      const spaceHeight = this.$root.active_space.height;

      return downloadSpace(spaceWidth, spaceHeight);
    },
    clearSpace() {
      const artifactIds = this.$root.active_space_artifacts.map((a) => a._id);
      const spaceId = this.$root.active_space._id;

      window.bulk_delete_artifacts(spaceId, artifactIds, () => {
        this.$root.active_space_artifacts = [];
        this.$root.deselect(true);
      });
    },
  },
};
</script>
