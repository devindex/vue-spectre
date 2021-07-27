<template>
  <div class="sample-code">
    <div class="sample-code-title">Sample code</div>
    <div class="sample-code-content">
      <pre v-highlightjs="code"><code :class="lang"></code></pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    code: {
      type: String,
    },
    lang: {
      type: String,
      default: 'html'
    },
  },
};
</script>

<style lang="scss">
@import '~spectre.css/src/variables';

.sample-code {
  border: $border-width solid $border-color;
  border-radius: $border-radius;
  margin-top: $unit-10;

  .sample-code-title {
    border-bottom: $border-width solid $border-color;
    color: $gray-color-dark;
    padding: $layout-spacing $unit-5;
  }

  .sample-code-content {
    code {
      line-height: unset;
      padding: $unit-5;
    }
    pre {
      margin: 0;
    }
  }
}
</style>
