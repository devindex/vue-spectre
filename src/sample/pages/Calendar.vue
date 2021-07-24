<template>
  <h3 class="s-title">Calendar</h3>

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

  <pre v-highlightjs="code"><code class="html"></code></pre>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
      code: `<dx-calendar v-model="date"></dx-calendar>`,
    }
  },
}
</script>

<style>

</style>
