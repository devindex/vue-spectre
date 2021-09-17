<template>
  <input
    type="text"
    class="form-input"
    v-bind="inputAttrs"
    :value="display"
    :placeholder="pattern"
    ref="input"
  >
</template>

<script>
import StringMask from 'string-mask';

export default {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
  },
  data() {
    return {
      lastValue: null,
      display: '',
    };
  },
  watch : {
    modelValue(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue, true);
      }
    },
  },
  created() {
    this.display = this.mask(this.modelValue, true);
  },
  methods: {
    onInput(e) {
      const currentValue = e.target.value;

      // Get current cursor position
      let position = this.$refs.input.selectionEnd;

      this.refresh(e.target.value);

      const newValue = this.display;

      if (this.$refs.input === document.activeElement) {
        // Find next cursor position
        if (position === currentValue.length) {
          position = newValue.length;
        } else if (position > 0 && position <= newValue.length) {
          const digit = currentValue.charAt(position - 1);

          if (
            digit !== newValue.charAt(position - 1)
            && digit === newValue.charAt(position)
          ) {
            position += 1;
          }
        }

        // Restore cursor position
        this.$refs.input.setSelectionRange(position, position);
      }
    },
    refresh(value) {
      const maskedValue = this.mask(value);
      const outValue = this.formatOutput(maskedValue);

      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (outValue !== this.lastValue) {
        this.lastValue = outValue;
        this.$emit('update:modelValue', outValue)
      }
    },
    mask(value, parse = false) {
      if (!value) return '';

      if (parse) {
        if (typeof value === 'string') {
          if (/\d{4}-\d{2}-\d{2}/.test(value)) {
            return value
              .substr(0, 10)
              .split('-')
              .reverse()
              .join('/');
          }
        }
      }

      const maskValue = value.replace(/\D/g, '');
      return StringMask.apply(maskValue, this.pattern).replace(/[^0-9]$/, '');
    },
    formatOutput(value) {
      return value.split('/').reverse().join('-');
    },
  },
  computed: {
    pattern() {
      return '00/00/0000';
    },
    inputAttrs() {
      return { ...this.$attrs, onInput: this.onInput };
    },
  },
}
</script>
