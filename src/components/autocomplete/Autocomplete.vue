<template>
  <div class="form-autocomplete">
    <form name="autocomplete" @submit.prevent.stop="onKeyEnter" autocomplete="off">
      <div class="input-group" :class="{'has-icon-right': loading}">
        <input
          type="text"
          class="form-input"
          autocomplete="off"
          v-model="search"
          :class="inputClass"
          :disabled="disabled"
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
        <i v-if="loading" class="form-icon loading"></i>
        <slot name="action"></slot>
      </div>
    </form>
    <div class="menu" v-if="canShow" :class="this.direction" :style="menuStyles">
      <div
        class="menu-item"
        v-for="(option, i) in localOptions"
        @click="select(option)"
        :class="itemClasses(option, i)"
        @mouseover="cursor = i"
      >
        <slot :option="option" :search="search" :highlight="highlightItem" :get-label="getLabel">
          <a v-html="highlightItem(getLabel(option))"></a>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Autocomplete',
    props: {
      options: {
        type: Array,
        default: () => [],
      },
      value: {
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
      wait: {
        type: Number,
        default: 300,
      },
      minLen: {
        type: Number,
        default: 1,
      },
      inputClass: {
        type: {},
      },
      highlight: {
        type: Boolean,
        default: false,
      },
      disabled: {
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
        default() {
          return !('search-change' in this.$listeners);
        }
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
        timeout: null,
        keepSearch: false,
      }
    },
    created() {
      this.updateDirection();
      this.setSearch(this.value);
    },
    watch: {
      value(newValue) {
        this.setSearch(newValue);
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
        this.$emit('input', item);
        this.$emit('selected', item);
      },
      onInput() {
        this.cursor = -1;
        this.activate();
        this.keepSearch = true;
        this.$emit('input', null);
        this.callSearchChange();
      },
      onFocus() {
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
          this.cursor = this.localOptions.length;
        }

        if (this.cursor > 0) {
          this.cursor--;
          this.itemView();
        }
      },
      onKeyDown() {
        if (this.cursor < this.localOptions.length - 1) {
          this.cursor++;
          this.itemView();
        }
      },
      onKeyEnter() {
        if (this.isOpen && this.localOptions[this.cursor]) {
          this.select(this.localOptions[this.cursor]);
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
        if (this.value && item) {
          if (typeof item === 'string') {
            return this.value === item;
          } else if (this.label) {
            return this.value[this.label] === item[this.label];
          }
        }
        return false;
      },
      callSearchChange() {
        clearTimeout(this.timeout);
        const search = this.search;
        if (this.canUpdateItems) {
          this.timeout = setTimeout(() => {
            this.$emit('search-change', search)
          }, this.wait);
        }
      },
      updateDirection() {
        this.$nextTick(() => {
          const { top, height } = this.$el.getBoundingClientRect();
          this.direction = top + (height / 2) > window.innerHeight / 2 ? 'top' : 'bottom';
        });
      },
    },
    computed: {
      localOptions() {
        if (this.internalSearch && this.search) {
          return this.options
            .filter((item) => (
              new RegExp(this.search, 'i').test(this.getLabel(item))
            ));
        }
        return this.options;
      },
      hasItems() {
        return this.localOptions.length > 0;
      },
      canUpdateItems() {
        return this.search.length >= this.minLen;
      },
      canShow() {
        return (this.isOpen && this.hasItems) || this.keepOpen;
      },
      menuStyles() {
        return {
          maxHeight: `${this.maxHeight}px`,
        };
      }
    }
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
    /*.menu-item {*/
    /*  cursor: pointer;*/
    /*  &:hover,*/
    /*  a:hover {*/
    /*    color: #545454;*/
    /*  }*/
    /*  .menu-item-tile {*/
    /*    display: flex;*/
    /*    align-items: center;*/
    /*    .avatar {*/
    /*      // margin-right: $layout-spacing;*/
    /*      display: flex;*/
    /*      align-items: center;*/
    /*      justify-content: center;*/
    /*    }*/
    /*    .name {*/
    /*      line-height: 1.3;*/
    /*      font-size: .7rem;*/
    /*    }*/
    /*    .description {*/
    /*      font-size: .6rem;*/
    /*      // color: $gray-color-dark*/
    /*    }*/
    /*  }*/
    /*}*/
    .menu-item-active {
      background-color: $secondary-color;
    }
    .highlight {
      font-weight: bold;
    }
  }
</style>
