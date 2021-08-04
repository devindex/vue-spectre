<template>
  <h3 class="s-title">Tabs</h3>

  <section class="component-section">
    <h4 class="section-title">Basic</h4>

    <dx-tabs @change="handler">
      <dx-tab label="Tab 1">
        <p>Tab content 1</p>
      </dx-tab>
      <dx-tab label="Tab 2">
        <p>Tab content 2</p>
      </dx-tab>
      <dx-tab label="Tab 3" :disabled="true">
        <p>Tab content 3</p>
      </dx-tab>
    </dx-tabs>

    <sample-code :code="code1"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Advanced</h4>

    <dx-tabs @change="handler">
      <template #action>
        <div class="input-group input-inline">
          <input class="form-input input-sm" type="text">
          <button class="btn btn-primary btn-sm input-group-btn">Search</button>
        </div>
      </template>

      <dx-tab label="Tab Label 1">
        <p>Tab content 1</p>
      </dx-tab>
      <dx-tab label="Tab Label 2">
        <p>Tab content 2</p>
      </dx-tab>
    </dx-tabs>

    <sample-code :code="code2"></sample-code>
  </section>
</template>

<script>
const code1 = `<dx-tabs @change="handler">
  <dx-tab label="Tab 1">
    Tab content 1
  </dx-tab>
  <dx-tab label="Tab 2">
    Tab content 2
  </dx-tab>
  <dx-tab label="Tab 3" :disabled="true">
    Tab content 3
  </dx-tab>
</dx-tabs>`;

const code2 = `<dx-tabs @change="handler">
  <template v-slot:action>
    <div class="input-group input-inline">
      <input class="form-input input-sm" type="text">
      <button class="btn btn-primary btn-sm input-group-btn">Search</button>
    </div>
  </template>

  <dx-tab label="Tab Label 1">
    <p>Tab content 1</p>
  </dx-tab>
  <dx-tab label="Tab Label 2">
    <p>Tab content 2</p>
  </dx-tab>
</dx-tabs>`;

export default {
  data() {
    return {
      code1,
      code2,
    };
  },
  methods: {
    handler(args) {
      // console.log(args);
    },
  },
}
</script>
