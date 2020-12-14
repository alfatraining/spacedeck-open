<template>
  <div id="typography" class="dialog">
    <div id="font">
      <ul
        v-for="(index, value) in fonts"
        :key="index"
        class="select-list overflow-y-scroll"
        style="max-height: 315px; width: 240px"
      >
        <li
          :class="{ checked: active_font == fonts[$index] }"
          @mousedown="applyFont($event, fonts[$index])"
          @touchstart="applyFont($event, fonts[$index])"
        >
          <span :style="{ 'font-family': fonts[$index] }">{{
            fonts[$index]
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
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
<style lang="css">
.color-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
