<template>
  <div id="shapes" class="av-shapes">
    <div class="dialog-section">
      <div class="btn-group av-shapes__av-btn-group">
        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('ellipse')"
        >
          <span class="icon av-icon icon-shape-circle"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('hexagon')"
        >
          <span class="icon av-icon icon-shape-hexagon"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('square')"
        >
          <span class="icon av-icon icon-shape-square"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('speechbubble')"
        >
          <span class="icon av-icon icon-shape-bubble"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('cloud')"
        >
          <span class="icon av-icon icon-shape-cloud"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('burst')"
        >
          <span class="icon av-icon icon-shape-burst"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('star')"
        >
          <span class="icon av-icon icon-shape-star"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('heart')"
        >
          <span class="icon av-icon icon-shape-heart"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addShape(param) {
      this.$root.add_shape(param);
      this.$root.opened_dialog = "none";
    },
  },
};
</script>

<style lang="css">
.av-shapes__av-btn-group {
  display: flex;
  padding-top: 12px;
  padding-left: 8px;
  padding-right: 8px;
}
.av-icon {
  font-size: 32px;
}
</style>
