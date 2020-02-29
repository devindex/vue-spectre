<template>
  <div class="notification-wrapper" v-if="show" @click="click">
    <div class="toast" :class="`toast-${type}`">
      <button class="btn btn-clear float-right" @click.stop="close"></button>
      <div class="notification-title">{{ title }}</div>
      <div class="notification-body text-ellipsis" v-if="body">{{ body }}</div>
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
      title: String,
      body: String
    },
    methods: {
      close () {
        this.$emit('close');
      },
      click () {
        this.$emit('click');
      }
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

  .toast {
    background-color: $gray-color-dark;
    border-color: $gray-color-dark;

    &.toast-info {
      background-color: $info-color;
      border-color: $info-color;
    }
  }

  .notification-wrapper {
    bottom: 1rem;
    position: absolute;
    right: 1rem;
    width: 15rem;
    z-index: $zindex-x + 10;
    .notification-title {
      font-weight: 600;
    }
    .notification-body {
      font-size: $font-size-sm;
      margin-top: $layout-spacing-sm;
      min-width: 1px;
    }
  }
</style>
