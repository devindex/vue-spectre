<template>
  <div>
    <br v-for="x in 30">
    <div class="mt-2 mb-2">
      <dx-autocomplete
        v-model="item1.value"
        :options="item1.options"
      >
        <template slot="action">
          <button
            class="btn btn-primary btn-action input-group-btn"
            @click="item1.value = null"
            v-if="item1.value">
            <i class="icon icon-cross"></i>
          </button>
          <button
            class="btn btn-primary btn-action input-group-btn"
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
        :options="item2.options"
        label="description"
        track-by="id"
      >
        <template slot="action">
          <button
            class="btn btn-primary btn-action input-group-btn"
            @click="item2.value = null"
            v-if="item2.value">
            <i class="icon icon-cross"></i>
          </button>
          <button
            class="btn btn-primary btn-action input-group-btn"
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
        :options="item3.options"
        label="title"
        track-by="id"
        :loading="item3.loading"
        :highlight="false"
        @search-change="updateItems"
      >
        <template slot="action">
          <button
            class="btn btn-primary btn-action input-group-btn"
            @click="item3.value = null"
            v-if="item3.value">
            <i class="icon icon-cross"></i>
          </button>
          <button
            class="btn btn-primary btn-action input-group-btn"
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
          options: options.map((item) => item.label),
        },
        item2: {
          value: options[9],
          options: options,
        },
        item3: {
          value: null,
          options: [],
          loading: false,
        }
      }
    },
    methods: {
      updateItems(search) {
        this.item3.loading = true;
        fetch('https://jsonplaceholder.typicode.com/posts?search=' + search)
          .then((response) => response.json())
          .then((items) => {
            this.item3.options = items
              .filter(({ title }) => new RegExp(search, 'i').test(title));
          })
          .catch(console.error)
          .then(() => this.item3.loading = false);
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
