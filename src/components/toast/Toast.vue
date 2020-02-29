<template>
  <div class="toast-wrapper" v-if="show">
    <div class="toast" :class="`toast-${type}`">
      <span>{{ message }}</span>
      <button class="btn btn-action btn-clear" @click="show = false"></button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      message: String
    },
    methods: {

    },
    mounted () {
      this.$nextTick(() => {
        document.body.appendChild(this.$el);
      })
    },
    destroyed () {
      this.$el.remove();
    },
  }
</script>

<style lang="scss">
  @import '~assets/scss/variables';

  .toast-wrapper {
    position: absolute;
    top: .5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: $zindex-x + 10;
    .toast {
      align-items: center;
      display: flex;
    }
    .btn {
      margin: 0 0 0 $layout-spacing-sm;
    }
  }
</style>
