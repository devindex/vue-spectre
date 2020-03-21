<template>
  <div class="columns">
    <div class="column col-5">
      <label for="input-date" class="form-label">Input Date (Brazil):</label>
      <dx-input-date v-model="date" id="input-date" />
    </div>
    <div class="column col-7">
      <div class="form-group">
        <label class="form-label">Output</label>
        <input type="text" class="form-input" :value="date" readonly>
      </div>
    </div>

    <div class="column col-5">
      <label for="input-number" class="form-label">Input Number (Brazil):</label>
      <dx-input-number v-model="number" id="input-number" :precision="2" />
    </div>
    <div class="column col-7">
      <div class="form-group">
        <label class="form-label">Output</label>
        <input type="text" class="form-input" :value="number" readonly>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: new Date().toISOString().substring(0, 10),
        number: 3.14,
      }
    },
  }
</script>

<style>

</style>
