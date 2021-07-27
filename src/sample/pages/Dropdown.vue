<template>
  <h3 class="s-title">Dropdown</h3>

  <section class="component-section">
    <h4 class="section-title">Simple array</h4>

    <dx-dropdown :items="item1.items" @select="item1.value = $event">
      <button class="btn btn-primary">
        Countries <i class="icon icon-caret"></i>
      </button>
    </dx-dropdown>

    <div class="mt-1" v-if="item1.value">
      <code>{{ item1.value }}</code>
    </div>

    <sample-code :code="item1.code"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Array of objects</h4>

    <dx-dropdown :items="item2.items" label="name" @select="item2.value = $event"
                 direction="right">
      <button class="btn btn-primary">
        Countries (right alignment) <i class="icon icon-caret"></i>
      </button>
      <template v-slot:item="{ item }">
        <a href="#">{{ item.name }} ({{ item.code }})</a>
      </template>
    </dx-dropdown>

    <div class="mt-1" v-if="item2.value">
      <code>{{ item2.value }}</code>
    </div>

    <sample-code :code="item2.code"></sample-code>
  </section>
</template>

<script>
const code1 = `<dx-dropdown :items="['Brazil', '-', ...]" @select="handler">
  <button class="btn btn-primary">
    Countries <i class="icon icon-caret"></i>
  </button>
</dx-dropdown>`;

const code2 = `<dx-dropdown :items="[{ code: 'BR', name: 'Brazil' }, '-', ...]"
    label="name" @select="handler" direction="right">
  <button class="btn btn-primary">
    Countries <i class="icon icon-caret"></i>
  </button>
  <template v-slot:item="{ item }">
    <a href="#">{{ item.name }} ({{ item.code }})</a>
  </template>
</dx-dropdown>`;

export default {
  data() {
    return {
      show: true,
      item1: {
        value: null,
        items: [
          'Brazil',
          '-',
          'Australia',
          'Canada',
          'New Zealand',
          'EUA',
        ],
        code: code1,
      },
      item2: {
        value: null,
        items: [
          { code: 'BR', name: 'Brazil' },
          '-',
          { code: 'AU', name: 'Australia' },
          { code: 'CA', name: 'Canada' },
          { code: 'NZ', name: 'New Zealand' },
          { code: 'US', name: 'EUA' },
        ],
        code: code2,
      },
    }
  },
}
</script>
