<template>
  <div
    v-if="toolbarPropsIn"
    v-cloak
    class="toolbar toolbar-properties avw-object-toolbar"
    :class="{ in: toolbarPropsIn, out: !toolbarPropsIn }"
  >
    <div class="btn-group dark vertical avw-button-group">
      <div
        class="dropdown top right dark"
        :class="{
          open: openedDialog.match('color'),
          'option-1': openedDialog == 'color-fill',
          'option-2': openedDialog == 'color-stroke',
          'option-3': openedDialog == 'color-text',
          'options-3': selectionMetrics.contains_text,
        }"
      >
        <button
          v-if="!selectionMetrics.contains_vectors"
          class="dropdown-toggle btn btn-icon avw-button"
          :class="{ open: openedDialog == 'color-fill' }"
          @click="openDialog('color-fill')"
        >
          <span class="icon icon-tool-fill icon-sm"></span>
          <span
            class="jewel"
            :style="{ 'background-color': activeStyle.fill_color }"
          ></span>
          <span
            v-if="activeStyle.fill_color == 'rgba(0,0,0,0)'"
            class="icon icon-cross-1"
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
          <span
            v-if="activeStyle.stroke_color == 'rgba(0,0,0,0)'"
            class="icon icon-cross-1"
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
          <span
            v-if="activeStyle.text_color == 'rgba(0,0,0,0)'"
            class="icon icon-cross-1"
          ></span>
        </button>
        <Color></Color>
      </div>

      <div
        class="dropdown top dark right"
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
            <i class="material-icons">format_align_center</i>
            <span class="icon-label">{{ $t("toolbar.align") }}</span>
          </button>
        </div>

        <text-align></text-align>
      </div>

      <div
        class="dropdown top dark right"
        :class="{ open: openedDialog == 'layout' }"
      >
        <div class="btn-collapse in">
          <button
            class="btn btn-icon-labeled avw-button"
            :class="{ open: openedDialog == 'layout' }"
            title="Layout"
            @click="openDialog('layout')"
          >
            <i class="material-icons">flip</i>
            <span class="icon-label">{{ $t("toolbar.layout") }}</span>
          </button>
        </div>

        <layout></layout>
      </div>
      <button
        class="btn btn-icon-labeled avw-button"
        title="Duplicate"
        @click="duplicateSelectedArtifacts()"
      >
        <i class="material-icons">content_copy</i>
        <span class="icon-label">{{ $t("toolbar.duplicate") }}</span>
      </button>

      <button
        class="btn btn-icon-labeled avw-button"
        title="Delete"
        @click="deleteSelectedArtifacts()"
      >
        <i class="material-icons">delete</i>
        <span class="icon-label">{{ $t("toolbar.delete") }}</span>
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
