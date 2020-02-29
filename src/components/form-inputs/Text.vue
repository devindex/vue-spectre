<template>
  <div class="form-group" :id="groupId">
    <label :for="inputId" class="form-label">{{ label }}</label>
    <input type="text" :id="inputId" class="form-input" :value="value"
           @input="onInput" v-if="rows === 1">
    <textarea :id="inputId" class="form-input" :value="value"
              @input="onInput" :rows="rows" v-else />
  </div>
</template>

<script>
  import inputMixin from './mixin';

  export default {
    mixins: [inputMixin],
    props: {
      rows: { type: Number, default: 1 },
    },
  }
</script>
