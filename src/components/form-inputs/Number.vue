<template>
  <div class="form-group" :id="groupId">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <input-number
      :id="inputId"
      :value="value"
      @input="onInput"
      :precision="precision"
    />
  </div>
</template>

<script>
  import inputMixin from './mixin';
  import InputNumber from '../inputs/Number';

  export default {
    mixins: [inputMixin],
    props: {
      value: [Number, String],
      precision: { type: Number, default: 0 }
    },
    components: {
      InputNumber,
    },
    methods: {
      onInput(value) {
        this.$emit('input', value);
      },
    },
  }
</script>
