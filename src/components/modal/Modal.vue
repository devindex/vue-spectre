<template>
  <teleport to="body">
    <transition name="modal">
      <div class="modal active" :class="classes" v-bind="$attrs" v-if="modelValue">
        <div class="modal-overlay" @click="overlayClick"></div>
        <div class="modal-container">
          <div class="modal-header" v-if="hasHeader">
            <button class="btn btn-clear float-right" v-if="closable" @click="close" />
            <slot name="header">
              <div class="modal-title" v-if="title">{{ title }}</div>
            </slot>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer" v-if="hasFooter">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { getOrSet } from '@/store';
import { randomHash } from '@/utils';

export default {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: null
    },
    clickToClose: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      hash: randomHash(),
      activeModals: getOrSet('activeModals', []),
    }
  },
  mounted() {
    if (this.modelValue) {
      this.activate();
    }
  },
  watch: {
    modelValue(value) {
      value ? this.activate() : this.deactivate();
    }
  },
  computed: {
    hasHeader() {
      return this.closable || this.title || 'header' in this.$slots;
    },
    hasFooter() {
      return 'footer' in this.$slots;
    },
    classes() {
      const classes = [];

      if (this.size !== null) {
        classes.push(`modal-${this.size}`)
      }

      return classes;
    }
  },
  methods: {
    activate() {
      this.activeModals.push(this.hash);
      if (this.closable) {
        document.addEventListener('keydown', this.closeListener);
      }
    },
    deactivate() {
      this.activeModals.forEach((hash, i) => {
        if (hash === this.hash) {
          this.activeModals.splice(i, 1);
        }
      });
      if (this.closable) {
        document.removeEventListener('keydown', this.closeListener);
      }
    },
    closeListener(e) {
      if (
        this.modelValue
        && e.keyCode === 27
        && this.activeModals[this.activeModals.length - 1] === this.hash
      ) {
        this.close();
      }
    },
    overlayClick() {
      if (this.clickToClose) {
        this.close();
      }
    },
    close() {
      if (this.closable) {
        this.$emit('update:modelValue', false);
      }
    }
  },
}
</script>

<style lang="scss">
.modal.active {
  &.modal-enter-active {
    transition: all .15s;
  }
  &.modal-leave-active {
    transition: all .3s;
  }
  &.modal-enter,
  &.modal-leave-to {
    opacity: 0;
  }
}
</style>
