<template>
  <div id="shapes" class="avw-shapes">
    <div class="dialog-section">
      <div class="btn-group avw-shapes__avw-btn-group">
        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('ellipse', $event)">
          <span class="icon avw-icon icon-shape-circle"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('hexagon', $event)">
          <span class="icon avw-icon icon-shape-hexagon"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('square', $event)">
          <span class="icon avw-icon icon-shape-square"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('speechbubble', $event)">
          <span class="icon avw-icon icon-shape-bubble"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('cloud', $event)">
          <span class="icon avw-icon icon-shape-cloud"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('burst', $event)">
          <span class="icon avw-icon icon-shape-burst"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('star', $event)">
          <span class="icon avw-icon icon-shape-star"></span>
        </button>

        <button class="btn btn-icon-labeled btn-transparent" @click="addShape('heart', $event)">
          <span class="icon avw-icon icon-shape-heart"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addShape(param, event) {
      this.$root.add_shape(param, event);
      this.$root.opened_dialog = 'none';
      this.$root.active_tool = 'pointer';
    },
  },
};
</script>
