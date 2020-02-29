<template>
  <div class="form-group input-choice" :id="groupId">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <template v-if="multiple">
      <select :id="inputId" class="form-select" :value="multipleValue"
              @input="onInput">
        <option value="">[Selecione]</option>
        <option v-for="item in filteredItems"
                :value="item.value">{{ item.text }}</option>
      </select>
      <div class="selected-items" v-if="selectedItems.length > 0">
        <div class="selected-item" v-for="(item, i) in selectedItems">
          <div class="input-group" v-if="editable">
            <input :value="itemText(item)" class="form-input input-sm" />
            <button class="btn btn-icon btn-action btn-sm btn-link btn-gray input-group-btn"
                    @click="removeItem(i)" tabindex="-1">
              <fa-icon :icon="['fal', 'times']"></fa-icon>
            </button>
          </div>
          <template v-else>
            <span>{{ itemText(item) }}</span>
            <button class="btn btn-icon btn-action btn-sm btn-link btn-gray"
                    @click="removeItem(i)" tabindex="-1">
              <fa-icon :icon="['fal', 'times']"></fa-icon>
            </button>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <select :id="inputId" class="form-select" :value="value"
              @input="onInput">
        <option value="">[Selecione]</option>
        <option v-for="item in items"
                :value="item.value">{{ item.text }}</option>
      </select>
    </template>
  </div>
</template>

<script>
  import inputMixin from './mixin';

  export default {
    mixins: [inputMixin],
    props: {
      value: [String, Array],
      options: {
        type: Array,
        default: () => [],
      },
      multiple: { type: Boolean, default: false },
      editable: { type: Boolean, default: false },
    },
    data() {
      return {
        defaultOptions: [],
        selectedItems: [],
        multipleValue: '',
      }
    },
    created() {
      if (typeof this.value === 'string') {
        this.defaultOptions = [this.value];
      } else if (Array.isArray(this.value)) {
        this.defaultOptions = [...this.value];
      }
    },
    mounted() {
      if (this.multiple && this.value) {
        this.selectedItems = this.value;
      }
    },
    methods: {
      removeItem(idx) {
        this.selectedItems.splice(idx, 1);
      },
      itemText(value) {
        const item = this.items.find(item => item.value === value);
        return item ? item.text : value;
      },
      onInput($event) {
        if (!this.multiple) {
          this.$emit('input', $event.target.value);
        } else {
          this.selectedItems.push($event.target.value);
          this.multipleValue = '';
          this.$emit('input', this.selectedItems);
        }
      },
    },
    computed: {
      items() {
        const options = Array.isArray(this.options) && this.options.length > 0
          ? this.options
          : this.defaultOptions;

        return options.map((item) => {
          if (typeof item === 'string') {
            return { value: item, text: item };
          }
          return {
            value: item.value || item.text,
            text: item.text,
          };
        });
      },
      filteredItems() {
        return this.items
          .filter((item) => !this.selectedItems.includes(item.value));
      }
    },
  }
</script>

<style lang="scss">
  @import '~assets/scss/variables';
  .input-choice {
    .selected-items {
      margin-top: $layout-spacing-sm;
    }
    .selected-item {
      align-items: center;
      background-color: lighten($dark-color, 62%);
      border-radius: $border-radius;
      display: flex;
      margin-top: $border-width;
      padding: $layout-spacing;
      .input-group {
        flex: 1;
      }
      span {
        flex: 1;
      }
    }
  }
</style>
