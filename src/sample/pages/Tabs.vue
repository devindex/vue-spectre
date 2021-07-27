<template>
  <h3 class="s-title">Tabs</h3>

  <dx-tabs @change="handler">
    <dx-tab label="Tab 1">
      <p>Tab content 1</p>
    </dx-tab>
    <dx-tab label="Tab 2">
      <p>Tab content 2</p>
    </dx-tab>
    <dx-tab label="Tab 3">
      <p>Tab content 3</p>
    </dx-tab>
  </dx-tabs>

  <sample-code :code="code"></sample-code>
</template>

<script>
export default {
  data() {
    return {
      code: `<dx-tabs @change="handler">
  <dx-tab label="Tab 1">
    Tab content 1
  </dx-tab>
  <dx-tab label="Tab 2">
    Tab content 2
  </dx-tab>
  <dx-tab label="Tab 3">
    Tab content 3
  </dx-tab>
</dx-tabs>`,
    };
  },
  methods: {
    handler(args) {
      console.log(args);
    },
  },
}
</script>
