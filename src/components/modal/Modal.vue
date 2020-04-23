<template>
  <div>
    <transition name="modal">
      <div class="modal active" :class="classes" v-if="value">
        <div class="modal-overlay" @click="overlayClick"></div>
        <div class="modal-container">
          <div class="modal-header">
            <button class="btn btn-clear float-right" v-if="closable" @click="close" />
            <div class="modal-title" v-if="title">{{ title }}</div>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { randomHash, initConfig } from '../../utils';

export default {
  props: {
    value: {
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
      activeModals: initConfig('activeModals', []),
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.body.appendChild(this.$el);

      if (this.value) {
        this.activate();
      }
    })
  },
  destroyed() {
    this.$el.remove();
  },
  watch: {
    value(value) {
      value ? this.activate() : this.deactivate();
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
        this.value
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
        this.$emit('input');
      }
    }
  },
  computed: {
    classes() {
      const classes = [];

      if (this.size !== null) {
        classes.push(`modal-${this.size}`)
      }

      return classes;
    }
  }
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
