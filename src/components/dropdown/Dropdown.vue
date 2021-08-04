<template>
  <div class="dropdown" :class="classes">
    <a class="c-hand" @click="toggle" tabindex="0"><slot></slot></a>

    <ul class="menu" v-show="active" :style="menuStyles" @click.stop>
      <template v-for="item in items">
        <li class="divider" v-if="item === '-'"></li>
        <li class="menu-item" @click="select(item)" v-else>
          <slot name="item" :item="item">
            <a href="#" @click.prevent>{{ getLabel(item) }}</a>
          </slot>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  emits: ['select'],
  props: {
    items: {
      type: Array,
      default: [],
    },
    label: {
      type: String,
    },
    direction: {
      type: String,
      enum: ['left', 'right'],
      default: 'left',
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      active: false
    }
  },
  beforeUnmount() {
    this.deactivate();
  },
  methods: {
    toggle() {
      this.active ? this.deactivate() : this.activate();
    },
    activate() {
      if (!this.disabled) {
        this.active = true;
        setTimeout(() => (
          document.addEventListener('click', this.deactivate)
        ), 1);
      }
    },
    deactivate() {
      this.active = false;
      document.removeEventListener('click', this.deactivate)
    },
    select(item) {
      this.$emit('select', item);
      this.deactivate();
    },
    getLabel(item) {
      return this.label ? item[this.label] : item;
    }
  },
  computed: {
    classes() {
      return {
        active: this.active,
        'dropdown-right': this.direction === 'right',
        'dropdown-disabled': this.disabled,
      }
    },
    menuStyles() {
      return {
        maxHeight: `${this.maxHeight}px`,
      }
    }
  }
}
</script>
