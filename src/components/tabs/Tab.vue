<template>
  <section
    class="tab-panel"
    v-show="isActive"
    :aria-hidden="!isActive"
    :id="`tab-${id}`"
    role="tabpanel"
  ><slot></slot></section>
</template>

<script>
import { randomHash } from  '@/utils';

export default {
  props: {
    id: {
      type: String,
      default: randomHash,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  created() {
    this.$parent.tabs.push(this);
  },
}
</script>
