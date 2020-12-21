<template>
  <div class="av-main-toolbar">
    <div class="av-submenu-wrapper">
      <button class="av-button" @click="openDialog('shapes')">Shape</button>
      <Shapes v-if="openedDialog == 'shapes'" class="av-submenu"></Shapes>
    </div>
    <button class="av-button" @click="startDrawingScribble">Scribble</button>
    <button class="av-button" @click="startDrawingArrow">Arrow</button>
    <!-- Disable file uploads for MVP -->
    <!-- <button class="av-button" @click="showFileUploadDialog()">Media</button>
    <input
      v-el:file-upload
      type="file"
      accept="*/*"
      multiple
      style="display: none"
      @change="handleFileUpload($event)"
    /> -->
    <button class="av-button" @click="activeTool('note')">Text</button>
    <div class="av-submenu-wrapper">
      <button class="av-button" @click="openDialog('background')">
        Background
      </button>
      <Background
        v-if="openedDialog == 'background'"
        class="av-submenu"
      ></Background>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    openedDialog() {
      return this.$root.opened_dialog;
    },
  },
  methods: {
    openDialog(dialog) {
      this.$root.open_dialog(dialog);
    },
    startDrawingScribble() {
      this.$root.active_style.stroke = 8;
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
    activeTool(param) {
      this.$root.active_tool = `${param}`;
    },
    share() {
      this.$root.activate_access();
    },
    togglePresentMode() {
      this.$root.toggle_present_mode();
    },
  },
};
</script>

<style lang="css">
.av-button {
  background-color: inherit;
  color: #f7f7ff;
  display: block;
  padding: 12px;
  text-decoration: none;
  width: 100%;
}
.av-submenu-wrapper {
  display: flex;
}
.av-submenu {
  border: 1px solid #2d3034;
  border-radius: 6px;
  background-color: #ffffff;
  position: absolute;
  color: #2d3034;
  left: 130px;
  z-index: 3500;
}
.av-main-toolbar {
  display: block;
  position: absolute;
  top: 50px;
  background-color: #2d3034;
  color: #f7f7ff;
  border-radius: 6px;
  margin-left: 8px;
  width: 120px;
  z-index: 3500;
}
</style>
