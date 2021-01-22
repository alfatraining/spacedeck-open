<template>
  <div class="avw-main-toolbar">
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'pointer' }"
      @click="enableSelectMode"
    >
      <span class="icon icon-border-dashed"></span>
      <span class="icon-label">Select</span>
    </button>
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'scribble' }"
      @click="startDrawingScribble"
    >
      <span class="icon icon-tool-scribble"></span>
      <span class="icon-label">Draw</span>
    </button>
    <div class="avw-submenu-wrapper">
      <button
        class="btn btn-icon-labeled avw-button"
        :class="{ open: openedDialog == 'shapes' }"
        @click="openDialog('shapes')"
      >
        <span class="icon icon-shapes"></span>
        <span class="icon-label">Shape</span>
      </button>
      <Shapes v-if="openedDialog == 'shapes'" class="avw-submenu"></Shapes>
    </div>
    <button
      class="btn btn-icon-labeled avw-button"
      :class="{ active: activeTool == 'arrow' }"
      @click="startDrawingArrow"
    >
      <span class="icon icon-tool-arrow"></span>
      <span class="icon-label">Arrow</span>
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
      <span class="icon icon-tool-text"></span>
      <span class="icon-label">Text</span>
    </button>
    <div class="avw-submenu-wrapper">
      <button
        class="btn btn-icon-labeled avw-button"
        :class="{ open: openedDialog == 'background' }"
        @click="openDialog('background')"
      >
        <span class="icon icon-picture-landscape"></span>
        <span class="icon-label">Background</span>
      </button>
      <Background
        v-if="openedDialog == 'background'"
        class="avw-submenu"
      ></Background>
    </div>
    <button class="btn btn-icon-labeled avw-button" @click="downloadSpace()">
      <span class="icon icon-download"></span>
      <span class="icon-label">Download</span>
    </button>
  </div>
</template>

<script>
import { toPng } from "html-to-image";
import download from "downloadjs";
import dayjs from "dayjs";

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
      this.$root.active_style.stroke = 4;
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
      const spaceHeight = this.$root.active_space.height;
      const spaceWidth = this.$root.active_space.width;

      toPng(document.getElementById("space"), {
        width: spaceWidth,
        height: spaceHeight,
      }).then(function (dataUrl) {
        download(dataUrl, `whiteboard-${dayjs().format("DD-MM-YYYY")}.png`);
      });
    },
  },
};
</script>
