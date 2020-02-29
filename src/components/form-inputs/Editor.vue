<template>
  <div class="form-group" :id="groupId">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <st-editor :id="inputId" :value="value" @input="onInput" />
  </div>
</template>

<script>
  import inputMixin from './mixin';

  export default {
    mixins: [inputMixin],
    methods: {
      onInput($event) {
        this.$emit('input', $event);
      }
    }
  }
</script>
