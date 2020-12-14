<template>
  <div v-if="activeSpaceLoaded" class="dialog">
    <div class="btn-group">
      <button
        class="btn btn-transparent btn-icon-labeled"
        title="Delete"
        @click="deleteSelectedArtifacts()"
      >
        <span class="icon icon-trash"></span>
        <span class="icon-label">Delete</span>
      </button>

      <button class="btn btn-divider"></button>

      <button
        v-if="activeSpaceRole == 'admin'"
        class="btn btn-transparent btn-icon-labeled"
        title="Lock"
        @click="toggleLockOfSelectedArtifacts()"
      >
        <span class="icon icon-lock-closed"></span>
        <span class="icon-label">Lock</span>
      </button>

      <button
        v-if="activeSpaceRole == 'admin'"
        class="btn btn-transparent btn-icon-labeled"
        title="Unlock"
        @click="toggleLockOfSelectedArtifacts()"
      >
        <span class="icon icon-lock-open"></span>
        <span class="icon-label">Unlock</span>
      </button>

      <button
        class="btn btn-transparent btn-icon-labeled"
        title="Copy"
        @click="duplicateSelectedArtifacts()"
      >
        <span class="icon icon-duplicate"></span>
        <span class="icon-label">Copy</span>
      </button>

      <button
        class="btn btn-transparent btn-icon-labeled"
        title="Link"
        @click="createLinkOnSelectedArtifacts()"
      >
        <span class="icon icon-link"></span>
        <span class="icon-label">Link</span>
      </button>

      <span v-if="firstSelectedArtifact">
        <button
          v-if="
            selectionMetrics.count == 1 && firstSelectedArtifact.payload_uri
          "
          class="btn btn-transparent btn-icon-labeled"
          title="Download"
          @click="downloadSelectedArtifacts()"
        >
          <span class="icon icon-download"></span>
          <span class="icon-label">Download</span>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  computed: {
    activeSpaceLoaded() {
      return this.$root.active_space_loaded;
    },
    selectionMetrics() {
      return this.$root.selection_metrics;
    },
    firstSelectedArtifact() {
      return this.$root.first_selected_artifact;
    },
    activeSpaceRole() {
      return this.$root.active_space_role;
    },
  },
  methods: {
    deleteSelectedArtifacts() {
      this.$root.delete_selected_artifacts();
    },
    toggleLockOfSelectedArtifacts() {
      this.$root.toggle_lock_of_selected_artifacts();
    },
    duplicateSelectedArtifacts() {
      this.$root.duplicate_selected_artifacts();
    },
    createLinkOnSelectedArtifacts() {
      this.$root.create_link_on_selected_artifacts();
    },
    downloadSelectedArtifacts() {
      this.$root.download_selected_artifacts();
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
