<template>
  <div id="typography" class="dialog">
    <div id="font">
      <ul class="select-list overflow-y-scroll" style="max-height: 315px; width: 240px">
        <li
          v-for="(font, index) in fonts"
          :key="index"
          :class="{ checked: $root.active_style.font_family == font }"
          @mousedown="applyFont($event, font)"
          @touchstart="applyFont($event, font)"
        >
          <span :style="{ 'font-family': font }">{{ font }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fonts: this.$root.fonts,
    };
  },
  methods: {
    applyFont(event, font) {
      this.$root.apply_font(event, font);
    },
  },
};
</script>
