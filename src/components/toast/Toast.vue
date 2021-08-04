<template>
  <teleport to="body">
    <div class="toast-wrapper" v-if="visible">
      <div class="toast" :class="type ? `toast-${type}` : ''">
        <button class="btn btn-clear float-right" @click="visible = false"></button>
        <h6 class="toast-title" v-if="title">{{ title }}</h6>
        <p class="toast-message">{{ message }}</p>
      </div>
    </div>
  </teleport>
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
    content: {
      type: [String, Object],
      default: '',
    }
  },
  data() {
    return {
      visible: this.show,
    };
  },
  watch: {
    show() {
      this.visible = this.show;
    },
  },
  computed: {
    parsedContent() {
      const content = typeof this.content === 'string'
        ? { message: this.content }
        : this.content;

      return {
        title: '',
        message: '',
        ...content,
      };
    },
    title() {
      return this.parsedContent.title;
    },
    message() {
      return this.parsedContent.message;
    },
  }
}
</script>

<style lang="scss">
@import "~spectre.css/src/variables";

.toast-wrapper {
  left: 50%;
  min-width: 10rem;
  position: absolute;
  top: .5rem;
  transform: translateX(-50%);
  z-index: $zindex-4 + 10;
}
</style>
