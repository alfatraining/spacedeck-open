<template>
  <div
    v-if="toolbarPropsIn"
    v-cloak
    class="toolbar toolbar-properties"
    :class="{ in: toolbarPropsIn, out: !toolbarPropsIn }"
  >
    <div class="btn-group light vertical avw-button-group">
      <div
        class="dropdown top right light"
        :class="{
          open: openedDialog.match('color'),
          'option-1': openedDialog == 'color-fill',
          'option-2': openedDialog == 'color-stroke',
          'option-3': openedDialog == 'color-text',
          'options-3': selectionMetrics.contains_text,
        }"
      >
        <button
          class="dropdown-toggle btn btn-icon avw-button"
          :class="{ open: openedDialog == 'color-fill' }"
          @click="openDialog('color-fill')"
        >
          <span class="icon icon-tool-fill icon-sm"></span>
          <span
            class="jewel"
            :style="{ 'background-color': activeStyle.fill_color }"
          ></span>
        </button>
        <br />
        <button
          class="dropdown-toggle btn btn-icon avw-button"
          :class="{ open: openedDialog == 'color-stroke' }"
          @click="openDialog('color-stroke')"
        >
          <span class="icon icon-tool-stroke icon-sm"></span>
          <span
            class="jewel jewel-stroke"
            :style="{ 'border-color': activeStyle.stroke_color }"
          ></span>
        </button>
        <br />
        <button
          v-if="selectionMetrics.contains_text"
          class="dropdown-toggle btn btn-icon avw-button"
          :class="{ open: openedDialog == 'color-text' }"
          @click="openDialog('color-text')"
        >
          <span class="icon icon-tool-text icon-sm"></span>
          <span
            class="jewel"
            :style="{ 'border-color': activeStyle.text_color }"
          >
            {{ activeStyle.font_size }}
          </span>
        </button>
        <Color></Color>
      </div>

      <div
        class="dropdown top light right"
        :class="{ open: openedDialog == 'type-align' }"
      >
        <div
          class="btn-collapse"
          :class="{ in: selectionMetrics.contains_text }"
        >
          <button
            class="btn btn-icon-labeled avw-button"
            :class="{ open: openedDialog == 'type-align' }"
            title="Align"
            @click="openDialog('type-align')"
          >
            <span class="icon icon-text-align-left-alt"></span>
            <span class="icon-label">Align</span>
          </button>
        </div>

        <text-align></text-align>
      </div>

      <div
        class="dropdown top light right"
        :class="{ open: openedDialog == 'layout' }"
      >
        <div class="btn-collapse in">
          <button
            class="btn btn-icon-labeled avw-button"
            :class="{ open: openedDialog == 'layout' }"
            title="Layout"
            @click="openDialog('layout')"
          >
            <span class="icon icon-cluster"></span>
            <span class="icon-label">Layout</span>
          </button>
        </div>

        <layout></layout>
      </div>
      <button
        class="btn btn-icon-labeled avw-button"
        title="Duplicate"
        @click="duplicateSelectedArtifacts()"
      >
        <span class="icon icon-duplicate"></span>
        <span class="icon-label">Duplicate</span>
      </button>

      <button
        class="btn btn-icon-labeled avw-button"
        title="Delete"
        @click="deleteSelectedArtifacts()"
      >
        <span class="icon icon-trash"></span>
        <span class="icon-label">Delete</span>
      </button>
    </div>
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
  computed: {
    activeSpaceLoaded() {
      return this.$root.active_space_loaded;
    },
    toolbarPropsIn() {
      return this.$root.toolbar_props_in;
    },
    activeStyle() {
      return this.$root.active_style;
    },
    openedDialog() {
      return this.$root.opened_dialog;
    },
    selectionMetrics() {
      return this.$root.selection_metrics;
    },
  },
  methods: {
    openDialog(param) {
      this.$root.open_dialog(param);
      this.toggleDialog(param);
    },
    toggleDialog(param) {
      this.toggles[param] = !this.toggles[param];
      Object.keys(this.toggles).forEach(
        (x) => x !== param && (this.toggles[x] = false)
      );
    },
    deleteSelectedArtifacts() {
      this.$root.delete_selected_artifacts();
    },
    duplicateSelectedArtifacts() {
      this.$root.duplicate_selected_artifacts();
    },
  },
};
</script>
