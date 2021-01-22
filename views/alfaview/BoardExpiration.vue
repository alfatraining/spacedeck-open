<template>
  <div class="avw-board-expiration">
    Board will be automatically deleted on: {{ remainingTime }}
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  computed: {
    remainingTime() {
      return dayjs(this.$root.active_space.updatedAt)
        .add(7, "days")
        .format("ddd DD.MM, HH:mm")
        .toString();
    },
  },
};
</script>
