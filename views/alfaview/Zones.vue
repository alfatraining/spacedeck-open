<template>
  <div id="zones" style="max-height: 500px; overflow-y: scroll">
    <h4 class="dialog-title">Zones</h4>
    <div class="dialog-section">
      <!--p v-if="zones.length<2">
      Turn your Space into a zooming presentation by placing some Zones and switch through them when presenting.
    </p-->

      <button class="btn btn-sm btn-dark" @click="addZone()">Add zone</button>
    </div>
    <!-- | orderBy 'order' -->
    <div
      v-for="(z, key) in zones"
      :key="key"
      class="dialog-section no-p"
      style="white-space: nowrap; text-align: left; cursor: pointer"
      @click="zoomToZone(zones[$index])"
    >
      <button class="btn btn-sm btn-transparent">
        {{ zones[$index].description }}
      </button>
      <button
        v-if="$index == currentZoneIndex"
        class="btn btn-sm btn-round btn-transparent btn-icon"
        @click="sortZoneUp(zones[$index])"
      >
        <span class="icon icon-triangle-up"></span>
      </button>
      <button
        v-if="$index == currentZoneIndex"
        class="btn btn-sm btn-round btn-transparent btn-icon"
        @click="sortZoneDown(zones[$index])"
      >
        <span class="icon icon-triangle-down"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentZoneIndex: 0,
    };
  },
  computed: {
    zones() {
      return this.$root.zones;
    },
  },
  methods: {
    addShape(param) {
      this.$root.add_shape(param);
      this.currentZoneIndex = this.$root.current_zone_idx;
    },
    zoomToZone(zone) {
      this.currentZoneIndex = this.$root.current_zone_idx;
      this.$root.zoom_to_zone(zone);
    },
    sortZoneUp(zone) {
      this.$root.sort_zone_up(zone);
    },
    sortZoneDown(zone) {
      this.$root.sort_zone_down(zone);
    },
    addZone() {
      this.$root.add_zone();
      this.$root.opened_dialog = "none";
    },
  },
};
</script>
