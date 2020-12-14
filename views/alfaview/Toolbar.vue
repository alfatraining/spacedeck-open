<template>
  <div class="av-main-toolbar">
    <div>
      <button class="av-button" @click="toggleDialog('shapes')">Shape</button>
      <Shapes
        v-if="toggles.shapes"
        class="av-submenu"
        @shape-added="toggleDialog('shapes')"
      ></Shapes>
    </div>
    <button class="av-button" @click="startDrawingScribble">Scribble</button>
    <button class="av-button" @click="startDrawingArrow">Arrow</button>
    <button class="av-button" @click="handleInsertImageUrl">Media</button>
    <button class="av-button" @click="activeTool('note')">Text</button>
    <div>
      <button class="av-button" @click="toggleDialog('zones')">Zones</button>
      <Zones v-if="toggles.zones" class="av-submenu"></Zones>
    </div>
    <div>
      <button class="av-button" @click="openDialog('background')">
        Canvas
      </button>
      <Background v-if="toggles.background" class="av-submenu"></Background>
    </div>
    <button class="av-button" @click="share">Share</button>
    <button class="av-button" @click="togglePresentMode">Present</button>
    <!-- <button class="av-button" @click="image('image')">image</button>  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggles: {
        shapes: false,
        zones: false,
        background: false,
      },
    };
  },
  methods: {
    openDialog(dialog) {
      this.$root.open_dialog(dialog);
      this.toggleDialog(dialog);
    },
    startDrawingScribble() {
      this.$root.start_drawing_scribble();
    },
    startDrawingArrow() {
      this.$root.start_drawing_arrow();
    },
    handleInsertImageUrl() {
      this.$root.handle_insert_image_url();
    },
    activeTool(param) {
      this.$root.active_tool = `${param}`;
    },
    share() {
      this.$root.activate_access();
    },
    togglePresentMode() {
      this.$root.toggle_present_mode();
    },
    toggleDialog(param) {
      this.toggles[param] = !this.toggles[param];
      Object.keys(this.toggles).forEach(
        (x) => x !== param && (this.toggles[x] = false)
      );
    },
  },
};
</script>

<style lang="css">
.av-button {
  /* display: block;
  position: relative;
  z-index: 3500;
  top: 50px;
  left:100px;
  border-radius: 28px;
  height: 32px;
  line-height: 32px;
  min-width: 95px;
  font-size: 14px;
  margin: 6px 12px;
  background: rgba(195, 196, 198, 0.4);
  color: rgba(17, 17, 46, 0.7);
  text-decoration: none; */
  background-color: inherit;
  color: #f7f7ff;
  display: block;
  padding: 12px;
  text-decoration: none;
  width: 100%;
}
.av-submenu {
  width: 520px;
  height: 100px;
  border: 1px solid;
  background-color: #f5f5f5;
  position: absolute;
  color: #2d3034;
  left: 200px;
  z-index: 3500;
}

.av-main-toolbar {
  display: block;
  position: absolute;
  top: 50px;
  left: 100px;
  background-color: #2d3034;
  color: #f7f7ff;
  border: 2px solid #0e9eda;
  border-radius: 6px;
  width: 150px;
  z-index: 3500;
}
</style>
