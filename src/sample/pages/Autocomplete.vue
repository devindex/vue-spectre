<template>
  <div>
    <div class="mt-2 mb-2">
      <dx-autocomplete
        v-model="item1.value"
        :source="item1.source"
      >
        <template slot="action">
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
    </div>

    <div class="divider"></div>

    <div class="mt-2 mb-2">
      <dx-autocomplete
        v-model="item2.value"
        :source="item2.source"
        label="description"
        track-by="id"
      >
        <template slot="action">
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
    </div>

    <div class="divider"></div>

    <div class="mt-2 mb-2">
      <dx-autocomplete
        v-model="item3.value"
        :source="item3.source"
        label="name"
        track-by="code"
        :highlight="false"
        placeholder="Countries search..."
      >
        <template slot="action">
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
    </div>
  </div>
</template>

<script>
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
        },
        item2: {
          value: options[9],
          source: options,
        },
        item3: {
          value: null,
          source: this.findCountries,
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
