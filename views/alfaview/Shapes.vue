<template>
  <div id="shapes">
    <h4 class="dialog-title">Shapes</h4>
    <div class="dialog-section">
      <div class="btn-group">
        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('ellipse')"
        >
          <span class="icon icon-shape-circle"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('hexagon')"
        >
          <span class="icon icon-shape-hexagon"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('square')"
        >
          <span class="icon icon-shape-square"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('speechbubble')"
        >
          <span class="icon icon-shape-bubble"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('cloud')"
        >
          <span class="icon icon-shape-cloud"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('burst')"
        >
          <span class="icon icon-shape-burst"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('star')"
        >
          <span class="icon icon-shape-star"></span>
          <span class="icon-label"></span>
        </button>

        <button
          class="btn btn-icon-labeled btn-transparent"
          @click="addShape('heart')"
        >
          <span class="icon icon-shape-heart"></span>
          <span class="icon-label"></span>
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
      this.$emit("shape-added");
    },
  },
};
</script>
