<template>
  <div class="form-group" :id="groupId">
    <label class="form-switch">
      <input type="checkbox" :id="inputId" :checked="value" @input="onInput">
      <i class="form-icon"></i> {{ label }}
    </label>
  </div>
</template>

<script>
  import inputMixin from './mixin';

  export default {
    mixins: [inputMixin],
    props: {
      value: Boolean,
    },
    methods: {
      onInput($event) {
        this.$emit('input', $event.target.checked);
      },
    },
  }
</script>
