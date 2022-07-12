<template>
  <div class="avw-legal-link__container">
    <a class="link avw-legal-link" :href="legalNotice" target="_blank">
      {{ $t('boardMetadata.legalNotice') }}
    </a>
    |
    <a class="link avw-legal-link" :href="privacyPolicyStatement" target="_blank">
      {{ $t('boardMetadata.privacyPolicyStatement') }}
    </a>
    |
    <a class="link avw-legal-link" :href="termsAndConditions" target="_blank">
      {{ $t('boardMetadata.termsAndConditions') }}
    </a>
  </div>
</template>

<script>
import { getBrowserLocale } from './utils';

export default {
  computed: {
    legalNotice: () => `https://alfaview.com/${getBrowserLocale()}/legal-notice/`,
    privacyPolicyStatement: () => `https://alfaview.com/${getBrowserLocale()}/privacy/`,
    termsAndConditions: () => `https://alfaview.com/${getBrowserLocale()}/terms/`,
  },
};
</script>
