<template>
  <div class="columns">
    <div class="column col-5">
      <dx-calendar v-model="date"></dx-calendar>
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
}
</script>

<style>

</style>
