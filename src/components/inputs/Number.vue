<template>
  <input
    type="text"
    class="form-input text-right"
    v-bind="inputAttrs"
    :value="display"
    :placeholder="placeholder"
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
      type: [Number, String],
    },
    precision: {
      type: Number,
      default: 0,
    }
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
        this.display = this.mask(newValue);
      }
    },
  },
  created() {
    this.display = this.mask(this.modelValue);
  },
  methods: {
    onInput(e) {
      this.refresh(e.target.value);
    },
    refresh(value) {
      const maskedValue = this.mask(value);
      const numberValue = this.toNumber(maskedValue);

      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (numberValue !== this.lastValue) {
        this.lastValue = numberValue;
        this.$emit('update:modelValue', numberValue)
      }
    },
    mask(value) {
      if (!value) {
        return '';
      }
      if (typeof value === 'number') {
        value = this.precision > 0
          ? value.toFixed(this.precision)
          : Math.trunc(value).toString();
      }
      const maskValue = Number(value.replace(/\D/g, '')).toString();
      return StringMask.apply(maskValue, this.pattern, { reverse: true });
    },
    toNumber(value) {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    },
  },
  computed: {
    pattern() {
      return `#.##${this.placeholder}`;
    },
    placeholder() {
      return this.precision > 0 ? `0,${'0'.repeat(this.precision)}` : '0';
    },
    inputAttrs() {
      return { ...this.$attrs, onInput: this.onInput };
    },
  },
}
</script>
