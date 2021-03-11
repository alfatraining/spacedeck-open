<template>
  <div class="avw-board-expiration">
    {{ $t('boardMetadata.deletionMessage', { date: expirationDate }) }}
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { getBrowserLocale } from './utils';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/de';

export default {
  computed: {
    expirationDate() {
      dayjs.extend(localizedFormat);
      dayjs.locale(getBrowserLocale());

      return dayjs(this.$root.active_space.updatedAt).add(7, 'days').format('llll').toString();
    },
  },
};
</script>
