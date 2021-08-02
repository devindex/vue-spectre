<template>
  <div class="form-autocomplete">
    <form name="autocomplete" @submit.prevent.stop="onKeyEnter" autocomplete="off">
      <div :class="inputGroupClasses">
        <input
          type="text"
          class="form-input"
          autocomplete="off"
          v-model="search"
          :id="inputId"
          :class="inputClass"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          @input="onInput"
          @focus.prevent="onFocus"
          @blur.prevent="onBlur"
          @keyup.esc.prevent="deactivate"
          @keydown.tab="onKeyEnter"
          @keypress.enter.prevent.stop="onKeyEnter"
          @keydown.down.prevent="onKeyDown"
          @keydown.up.prevent="onKeyUp"
        >
        <i v-if="canShowLoading" class="form-icon loading"></i>
        <slot name="action"></slot>
      </div>
    </form>
    <ul class="menu" v-if="canShow" :class="this.direction" :style="menuStyles">
      <li
        class="menu-item"
        v-for="(item, i) in availableItems"
        @click="select(item)"
        :class="itemClasses(item, i)"
        @mouseover="cursor = i"
      >
        <slot :item="item" :search="search" :highlight="highlightItem" :get-label="getLabel">
          <a v-html="highlightItem(getLabel(item))"></a>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Autocomplete',
  emits: ['update:modelValue', 'select', 'focus', 'blur'],
  props: {
    source: {
      type: [Array, Function],
      default: () => [],
    },
    modelValue: {
      type: null,
    },
    trackBy: {
      type: String,
    },
    label: {
      type: String,
    },
    customLabel: {
      type: Function,
      default(option, label) {
        if (!option) {
          return '';
        }
        return label ? option[label] : option;
      }
    },
    debounce: {
      type: Number,
      default: 300,
    },
    minLen: {
      type: Number,
      default: 3,
    },
    inputClass: {
      type: [String, Array, Object],
    },
    inputId: {
      type: String,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Number,
      default: 300,
    },
    internalSearch: {
      type: Boolean,
      default: undefined,
    },
    keepOpen: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      search: '',
      isOpen: false,
      cursor: -1,
      direction: '',
      keepSearch: false,
      items: [],
      timeout: null,
      isLoading: false,
      dynamic: typeof this.source === 'function',
    }
  },
  created() {
    this.updateDirection();
    this.setSearch(this.modelValue);
  },
  watch: {
    modelValue(newValue) {
      this.setSearch(newValue);
    }
  },
  computed: {
    availableItems() {
      if (this.dynamic) {
        return this.items;
      }

      if (this.internalSearch !== false && this.search) {
        return this.source
          .filter((item) => (
            new RegExp(this.search, 'i').test(this.getLabel(item))
          ));
      }
      return this.source;
    },
    hasItems() {
      return this.availableItems.length > 0;
    },
    canUpdateItems() {
      return this.search.length >= this.minLen;
    },
    canShow() {
      return (this.isOpen && this.hasItems) || this.keepOpen;
    },
    canShowLoading() {
      return this.loading || this.isLoading;
    },
    inputGroupClasses() {
      return {
        'has-icon-right': this.canShowLoading,
        'input-group': 'action' in this.$slots
      }
    },
    menuStyles() {
      return {
        maxHeight: `${this.maxHeight}px`,
      };
    }
  },
  methods: {
    activate() {
      this.isOpen = true;
    },
    deactivate() {
      this.isOpen = false;
      this.cursor = -1;
    },
    highlightItem(value) {
      if (this.highlight && typeof value === 'string') {
        return value
          .replace(
            new RegExp(this.search.trim(), 'ig'),
            (v) => (`<b class="highlight">${v}</b>`)
          );
      }
      return value;
    },
    select(item) {
      this.setSearch(item);
      this.$emit('update:modelValue', item);
      this.$nextTick(() => {
        this.$emit('select', item);
      });
    },
    onInput() {
      this.cursor = -1;
      this.activate();
      this.keepSearch = true;
      this.$emit('update:modelValue', null);
      this.updateItems();
    },
    onFocus() {
      this.items = [];
      this.updateDirection();
      this.$emit('focus', this.search);
      this.activate();
    },
    onBlur() {
      this.$emit('blur', this.search);
      setTimeout(this.deactivate, 200);
    },
    onKeyUp() {
      if (this.cursor === -1) {
        this.cursor = this.availableItems.length;
      }

      if (this.cursor > 0) {
        this.cursor--;
        this.itemView();
      }
    },
    onKeyDown() {
      if (this.cursor < this.availableItems.length - 1) {
        this.cursor++;
        this.itemView();
      }
    },
    onKeyEnter() {
      if (this.isOpen && this.availableItems[this.cursor]) {
        this.select(this.availableItems[this.cursor]);
        this.isOpen = false;
      }
    },

    itemView() {
      // TODO
    },
    setSearch(item) {
      if (item || !this.keepSearch) {
        this.keepSearch = false;
        this.search = this.getLabel(item);
      }
    },
    getLabel(item) {
      if (!item) {
        return '';
      }
      return this.customLabel(item, this.label)
    },
    itemClasses(item, i) {
      return {
        'menu-item-active': i === this.cursor,
        'menu-item-selected': this.isSelectedItem(item),
      };
    },
    isSelectedItem(item) {
      if (this.modelValue && item) {
        if (typeof item === 'string') {
          return this.modelValue === item;
        } else if (this.label) {
          return this.modelValue[this.label] === item[this.label];
        }
      }
      return false;
    },
    updateItems() {
      if (!this.dynamic) return;

      this.items = [];
      clearTimeout(this.timeout);

      if (!this.canUpdateItems) return;

      const search = this.search;
      this.timeout = setTimeout(() => this.callSource(search), this.debounce);
    },
    callSource(search) {
      this.isLoading = true;
      Promise.resolve()
        .then(() => this.source(search))
        .catch(() => [])
        .then((items) => {
          this.items = items;
          this.isLoading = false;
        })
    },
    updateDirection() {
      this.$nextTick(() => {
        const { top, height } = this.$el.getBoundingClientRect();
        this.direction = top + (height / 2) > window.innerHeight / 2 ? 'top' : 'bottom';
      });
    },
  },
}
</script>

<style lang="scss">
@import "~spectre.css/src/variables";

.form-autocomplete {
  .menu {
    overflow-y: auto;
    &.top {
      bottom: 100%;
      top: auto;
      transform: translateY(-$layout-spacing-sm);
    }
  }
  .loading:not(:last-child) {
    right: 1.85rem;
  }
  .menu-item {
    a {
      cursor: pointer;
    }
  }
  .menu-item-active {
    background-color: $secondary-color;
  }
  .highlight {
    font-weight: bold;
  }
}
</style>
