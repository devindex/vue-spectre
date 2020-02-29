<template>
  <section class="tab-panel" v-show="isActive" :aria-hidden="!isActive" :id="hash" role="tabpanel">
    <slot></slot>
  </section>
</template>

<script>
  export default {
    props: {
      id: { default: null },
      name: { required: true }
    },
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      hash () {
        if (this.id) {
          return this.id;
        } else {
          return this.name.toLowerCase().replace(/ /g, '-');
        }
      }
    }
  }
</script>
