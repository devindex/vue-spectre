<template>
  <div class="columns">
    <div class="column col-5">
      <dx-calendar :date="date" @select="select" />
    </div>
    <div class="column col-7">
      <div class="form-group">
        <label for="date" class="form-label">Selected date:</label>
        <input type="text" id="date" class="form-input" :value="date" readonly>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: new Date(),
      }
    },
    methods: {
      select({ date }) {
        this.date = date;
      }
    },
  }
</script>

<style>

</style>
