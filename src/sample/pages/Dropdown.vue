<template>
  <div>
    <div class="mt-2 mb-2">
      <dx-dropdown :items="item1.items" @select="item1.value = $event">
        <button class="btn btn-primary">
          Countries (Simple array) <i class="icon icon-caret"></i>
        </button>
      </dx-dropdown>

      <div class="mt-1" v-if="item1.value">
        <code>{{ item1.value }}</code>
      </div>
    </div>

    <div class="mt-2 mb-2">
      <dx-dropdown :items="item2.items" label="name" @select="item2.value = $event"
                   direction="right">
        <button class="btn btn-primary">
          Countries (Array of objects) <i class="icon icon-caret"></i>
        </button>
        <template v-slot:item="{ item }">
          <a href="#">{{ item.name }} ({{ item.code }})</a>
        </template>
      </dx-dropdown>

      <div class="mt-1" v-if="item2.value">
        <code>{{ item2.value }}</code>
      </div>
    </div>
  </div>
</template>

<script>
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
        },
      }
    },
  }
</script>
