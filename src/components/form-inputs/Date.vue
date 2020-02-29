<template>
  <div class="form-group" :id="groupId">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <input type="text" :id="inputId" class="form-input" :value="value"
           @input="onInput" v-mask-date.br>
  </div>
</template>

<script>
  import inputMixin from './mixin';

  export default {
    mixins: [inputMixin],
  }
</script>
