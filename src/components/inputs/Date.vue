<template>
  <input
    type="text"
    class="form-input"
    :value="display"
    v-on="inputListeners"
    :placeholder="pattern"
    ref="input"
  >
</template>

<script>
import StringMask from 'string-mask';

export default {
  props: {
    value: {
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
    value(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue, true);
      }
    },
  },
  created() {
    this.display = this.mask(this.value, true);
  },
  methods: {
    onInput(e) {
      this.refresh(e.target.value);
    },
    refresh(value) {
      const maskedValue = this.mask(value);
      const outValue = this.formatOutput(maskedValue);

      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (outValue !== this.lastValue) {
        this.lastValue = outValue;
        this.$emit('input', outValue)
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
    inputListeners() {
      return { ...this.$listeners, input: this.onInput };
    },
  },
}
</script>
