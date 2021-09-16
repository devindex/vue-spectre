<template>
  <h3 class="s-title">Form inputs</h3>

  <section class="component-section">
    <h4 class="section-title">Input date (dd/mm/yyyy)</h4>

    <div class="columns">
      <div class="column col-6 col-sm-8 col-xs-12">
        <div class="input-group">
          <dx-input-date v-model="date" id="input-date" />
          <input type="text" class="form-input text-center text-gray" :value="date" readonly>
          <button class="btn btn-primary input-group-btn" @click="randomDate">
            <i class="icon icon-refresh"></i>
          </button>
          <button class="btn btn-error input-group-btn" @click="date = ''" :disabled="!date">
            <i class="icon icon-cross"></i>
          </button>
        </div>
      </div>
    </div>

    <sample-code :code="code.inputDate"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Input number (Brazilian format)</h4>
    <div class="columns">
      <div class="column col-6 col-sm-8 col-xs-12">
        <div class="input-group">
          <dx-input-number v-model="number" id="input-number" :precision="2" />
          <input type="text" class="form-input text-center text-gray" :value="number" readonly>
          <button class="btn btn-primary input-group-btn" @click="randomNumber">
            <i class="icon icon-refresh"></i>
          </button>
          <button class="btn btn-error input-group-btn" @click="number = ''" :disabled="!number">
            <i class="icon icon-cross"></i>
          </button>
        </div>
      </div>
    </div>

    <sample-code :code="code.inputNumber"></sample-code>
  </section>
</template>

<script>
const inputDateCode = `<dx-input-date v-model="date"></dx-input-date>`;
const inputNumberCode = `<dx-input-number v-model="number" :precision="2"></dx-input-number>`;

export default {
  data() {
    return {
      date: new Date().toISOString().substring(0, 10),
      number: 3.14,
      code: {
        inputDate: inputDateCode,
        inputNumber: inputNumberCode,
      },
    }
  },
  methods: {
    randomDate() {
      const date = new Date();
      date.setDate(date.getDate() + Math.round(Math.random() * 100));
      this.date = date.toISOString().substring(0, 10);
    },
    randomNumber() {
      this.number = Math.round(Math.random() * 1000) / 100;
    },
  },
}
</script>

<style lang="scss">

</style>
