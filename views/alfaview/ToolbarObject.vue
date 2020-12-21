<template>
  <div
    v-if="toolbarPropsIn"
    v-cloak
    style="margin-right: 300px"
    class="toolbar toolbar-properties"
    :class="{ in: toolbarPropsIn, out: !toolbarPropsIn }"
  >
    <div class="btn-group light vertical">
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
          class="dropdown-toggle btn btn-icon btn-transparent"
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
          class="dropdown-toggle btn btn-icon btn-transparent"
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
          class="dropdown-toggle btn btn-icon btn-transparent"
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
        :class="{ open: openedDialog == 'text-styles' }"
      >
        <div class="btn-collapse in">
          <button
            class="btn btn-transparent btn-icon-labeled"
            :class="{ open: openedDialog == 'text-styles' }"
            title="Styles"
            @click="openDialog('text-styles')"
          >
            <span class="icon icon-text-styles"></span>
            <span class="icon-label">Styles</span>
          </button>
        </div>
        <text-styles></text-styles>
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
            class="btn btn-transparent btn-icon-labeled"
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
            class="btn btn-transparent btn-icon-labeled"
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

      <div
        class="dropdown top light right"
        :class="{ open: openedDialog == 'text-settings' }"
      >
        <div class="btn-collapse in">
          <button
            class="btn btn-transparent btn-icon-labeled"
            :class="{ open: openedDialog == 'text-settings' }"
            title="Font"
            @click="openDialog('text-settings')"
          >
            <span class="icon icon-text-typeface"></span>
            <span class="icon-label">Font</span>
          </button>
        </div>

        <text-digits></text-digits>
      </div>

      <button class="btn btn-divider"></button>

      <div
        class="dropdown top light right"
        :class="{ open: openedDialog == 'object-options' }"
      >
        <button
          class="btn btn-transparent btn-icon-labeled"
          :class="{ open: openedDialog == 'object-options' }"
          @click="openDialog('object-options')"
        >
          <span class="icon icon-cogwheel"></span>
          <span class="icon-label">More</span>
        </button>

        <object-options></object-options>
      </div>
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
    idActiveSpaceRole(role) {
      return this.$root.is_active_space_role(role);
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

<style lang="css"></style>
