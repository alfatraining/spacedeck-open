<template>
  <div v-if="activeStyle" class="dialog">
    <div id="colors" class="relative">
      <div class="color-picker" :class="{ invis: colorMode == 'palette' }">
        <div
          id="fg-color-picker"
          v-sd-fader="true"
          class="color"
          :style="{
            'background-color':
              'hsl(' + (colorPickerHue / 255) * 360 + ', 100%, 50%)',
          }"
          sd-fader-var-x="colorPickerSaturation"
          sd-fader-var-y="colorPickerValue"
          sd-fader-max-x="255"
          sd-fader-max-y="255"
        >
          <div class="fader-constraint mask" style="pointer-events: none"></div>
          <button class="fader-selector" style="pointer-events: none"></button>
        </div>

        <div
          v-sd-fader="true"
          class="color-hue"
          sd-fader-var-x="colorPickerHue"
        >
          <button class="fader-selector" style="pointer-events: none"></button>
        </div>

        <div
          v-sd-fader="true"
          class="color-opacity"
          sd-fader-var-x="colorPickerOpacity"
        >
          <div class="fit"></div>
          <button class="fader-selector" style="pointer-events: none"></button>
        </div>

        <div id="color-rgba" class="dialog-section no-p">
          <div class="input-row">
            <div>
              <label class="color-hsva-hue">H</label>
              <input
                v-model="colorPickerHue"
                class="input input-md input-nude text-center"
                spellcheck="false"
                maxlength="3"
                type="number"
              />
            </div>
            <div>
              <label class="color-hsva-saturation">S</label>
              <input
                v-model="colorPickerSaturation"
                class="input input-md input-nude text-center"
                spellcheck="false"
                maxlength="3"
                type="number"
              />
            </div>
            <div>
              <label class="color-hsva-brightness">V</label>
              <input
                v-model="colorPickerValue"
                class="input input-md input-nude text-center"
                spellcheck="false"
                maxlength="3"
                type="number"
              />
            </div>
            <div>
              <label class="color-hsva-alpha">A</label>
              <input
                v-model="colorPickerOpacity"
                class="input input-md input-nude text-center"
                spellcheck="false"
                maxlength="3"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="color-wrap color-palette r-10"
        :class="{ invis: colorMode != 'palette' }"
      >
        <!-- <div class="adapt overflow-y-scroll">
          <button class="btn btn-round btn-darken"
            v-on:click="applySwatchColor(s)"
            v-for="s in swatches"
            v-bind:style="{'background-color': s.hex}">
            <span class="icon" v-bind:class="{'icon-cross-0':s.hex=='rgba(0,0,0,0)'}"></span>
          </button>
        </div> -->
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

    <div
      v-if="activeStyle"
      v-show="openedDialog == 'color-stroke'"
      class="dialog-section no-p-h no-p-b"
    >
      <div class="input-row">
        <div class="form-group no-m">
          <label class="label label-sm">Stroke</label>
          <input
            v-model="activeStyle.stroke"
            class="input no-b no-p text-center text-large"
            spellcheck="false"
            type="number"
          />
          <button
            v-sd-fader="true"
            tabindex="-1"
            class="input-drag btn btn-transparent btn-icon"
            sd-fader-var-y="active_style.stroke"
            sd-fader-min-y="0"
            sd-fader-max-y="100"
            sd-fader-step="1"
          >
            <span class="icon icon-triangles-vertical"></span>
          </button>
          <span class="input-unit">px</span>
        </div>

        <div class="form-group no-m">
          <label class="label label-sm">Border Radius</label>
          <input
            v-model="activeStyle.border_radius"
            class="input no-b no-p text-center text-large"
            spellcheck="false"
            type="number"
          />
          <button
            v-sd-fader="true"
            tabindex="-1"
            class="input-drag btn btn-transparent btn-icon"
            sd-fader-var-y="active_style.border_radius"
            sd-fader-min-y="0"
            sd-fader-max-y="500"
            sd-fader-step="1"
          >
            <span class="icon icon-triangles-vertical"></span>
          </button>
          <span class="input-unit">px</span>
        </div>
      </div>
    </div>

    <div
      v-show="openedDialog == 'color-text'"
      class="dialog-section no-p-b no-p-h"
    >
      <div class="input-row">
        <div class="form-group no-m">
          <label class="label label-sm text-center">Font size</label>
          <input
            v-model="activeStyle.font_size"
            class="input no-b no-p text-center text-large"
            spellcheck="false"
            type="text"
            pattern="[0-9]"
            maxlength="64"
          />

          <button
            v-sd-fader="true"
            tabindex="-1"
            class="input-drag btn btn-transparent btn-icon"
            style="cursor: ns-resize"
            sd-fader-var-y="active_style.font_size"
            sd-fader-min-y="30"
            sd-fader-max-y="200"
            sd-fader-sens="5"
          >
            <span class="icon icon-triangles-vertical"></span>
          </button>
          <span class="input-unit">px</span>
        </div>
        <div class="btn-group">
          <button
            class="btn btn-transparent btn-icon-labeled"
            @click="applyFormatting($event, 'bold')"
          >
            <span class="icon icon-text-bold"></span>
            <span class="icon-label">Bold</span>
          </button>
          <button
            class="btn btn-transparent btn-icon-labeled"
            @click="applyFormatting($event, 'italic')"
          >
            <span class="icon icon-text-italic"></span>
            <span class="icon-label">Italic</span>
          </button>
          <button
            class="btn btn-transparent btn-icon-labeled"
            @click="applyFormatting($event, 'underline')"
          >
            <span class="icon icon-text-underline"></span>
            <span class="icon-label">Underl.</span>
          </button>
          <button
            class="btn btn-transparent btn-icon-labeled"
            @click="applyFormatting($event, 'strikeThrough')"
          >
            <span class="icon icon-text-strike"></span>
            <span class="icon-label">Strike</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentZoneIndex: 0,
      activeStyle: this.$root.active_style,
      colorPickerHue: this.$root.color_picker_hue,
      colorPickerSaturation: this.$root.color_picker_saturation,
      colorPickerValue: this.$root.color_picker_value,
      colorPickerOpacity: this.$root.color_picker_opacity,
      swatches: this.$root.swatches,
    };
  },
  computed: {
    colorMode() {
      return this.$root.color_mode;
    },
    directives() {
      return this.$root.$options.directives;
    },
    openedDialog() {
      return this.$root.opened_dialog;
    },
  },
  methods: {
    applySwatchColor(swatche) {
      this.$root.apply_swatch_color(swatche);
    },
    applyFormatting(event, style) {
      this.$root.apply_formatting(event, style);
    },
  },
};
</script>
