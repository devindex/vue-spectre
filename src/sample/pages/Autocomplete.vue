<template>
  <h3 class="s-title">Autocomplete</h3>

  <section class="component-section">
    <h4 class="section-title">Basic - Array of strings</h4>

    <dx-autocomplete
      v-model="item1.value"
      :source="item1.source"
    >
      <template v-slot:action>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          @click="item1.value = null"
          v-if="item1.value">
          <i class="icon icon-cross"></i>
        </button>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          v-else>
          <i class="icon icon-search"></i>
        </button>
      </template>
    </dx-autocomplete>
    <div class="mt-1" v-if="item1.value">
      <code>{{ item1.value }}</code>
    </div>

    <sample-code :code="item1.code"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Basic - Array of objects</h4>

    <dx-autocomplete
      v-model="item2.value"
      :source="item2.source"
      label="description"
      track-by="id"
    >
      <template v-slot:action>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          @click="item2.value = null"
          v-if="item2.value">
          <i class="icon icon-cross"></i>
        </button>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          v-else>
          <i class="icon icon-search"></i>
        </button>
      </template>
    </dx-autocomplete>
    <div class="mt-1" v-if="item2.value">
      <code>{{ item2.value }}</code>
    </div>

    <sample-code :code="item2.code"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Advanced - Async API</h4>

    <dx-autocomplete
      v-model="item3.value"
      :source="item3.source"
      label="name"
      track-by="code"
      :highlight="false"
      placeholder="Countries search..."
    >
      <template v-slot:action>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          @click="item3.value = null"
          v-if="item3.value">
          <i class="icon icon-cross"></i>
        </button>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          v-else>
          <i class="icon icon-search"></i>
        </button>
      </template>
    </dx-autocomplete>
    <div class="mt-1" v-if="item3.value">
      <code>{{ item3.value }}</code>
    </div>

    <sample-code :code="item3.code"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Advanced - Custom template</h4>

    <dx-autocomplete
      v-model="item4.value"
      :source="item4.source"
      label="name"
      track-by="code"
      :highlight="false"
      placeholder="Countries search..."
    >
      <template v-slot:action>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          @click="item4.value = null"
          v-if="item4.value">
          <i class="icon icon-cross"></i>
        </button>
        <button
          class="btn btn-primary btn-action input-group-btn"
          tabindex="-1"
          v-else>
          <i class="icon icon-search"></i>
        </button>
      </template>
      <template v-slot:default="{ item, highlight, getLabel }">
        <a>
          <span v-html="highlight(getLabel(item))"></span>
          <small> ({{ item.capital }})</small>
        </a>
        <div class="menu-badge">
          <label class="label">{{ item.code }}</label>
        </div>
      </template>
    </dx-autocomplete>
    <div class="mt-1" v-if="item4.value">
      <code>{{ item4.value }}</code>
    </div>

    <sample-code :code="item4.code"></sample-code>
  </section>
</template>

<script>
const code1 = `<dx-autocomplete
  v-model="value"
  :source="['1', '2', '...']"
></dx-autocomplete>`;

const code2 = `<dx-autocomplete
  v-model="value"
  :source="[{ id: 1, label: 'Item 1', description: 'Description 1' }, ...]"
  label="description"
  track-by="id"
></dx-autocomplete>`;

const code3 = `<dx-autocomplete
  v-model="value"
  :source="myAsyncFunction"
  label="name"
  track-by="code"
  :highlight="false"
  placeholder="Countries search..."
></dx-autocomplete>`;

const code4 = `<dx-autocomplete
  v-model="value"
  :source="myAsyncFunction"
  label="name"
  track-by="code"
  :highlight="false"
  placeholder="Countries search..."
>
  <template v-slot:default="{ item, highlight, getLabel }">
    <a>
      <span v-html="highlight(getLabel(item))"></span>
      <small> ({{ item.capital }})</small>
    </a>
    <div class="menu-badge">
      <label class="label">{{ item.code }}</label>
    </div>
  </template>

  <template v-slot:action>
    <button class="btn btn-primary btn-action input-group-btn"
      <i class="icon icon-cross"></i>
    </button>
  </template>
</dx-autocomplete>`;

const options = new Array(10)
  .fill('')
  .map((x, i) => ({
    id: i + 1,
    label: `Item number ${i + 1}`,
    description: `Description of item number ${i + 1}`,
  }));

export default {
  data() {
    return {
      item1: {
        value: options[6].label,
        source: options.map((item) => item.label),
        code: code1,
      },
      item2: {
        value: options[9],
        source: options,
        code: code2,
      },
      item3: {
        value: null,
        source: this.findCountries,
        code: code3,
      },
      item4: {
        value: null,
        source: this.findCountries,
        code: code4,
      }
    }
  },
  methods: {
    findCountries(search) {
      return fetch('https://restcountries.eu/rest/v2/name/' + search)
        .then((response) => new Promise((resolve) => {
          setTimeout(() => resolve(response.json()), 300);
        }))
        .then((items) => {
          return items.map((item) => ({
            name: item.name,
            code: item.alpha2Code,
            capital: item.capital,
            region: item.subregion,
            nativeName: item.nativeName,
            currency: item.currencies.length ? item.currencies[0] : null,
            flag: item.flag,
          }));
        });
    }
  }
}
</script>

<style>
  /*body:after {*/
  /*  content: "";*/
  /*  height: 1px;*/
  /*  width: 100%;*/
  /*  background-color: #ccc;*/
  /*  position: fixed;*/
  /*  z-index: 999;*/
  /*  top: 50%;*/
  /*}*/
</style>
