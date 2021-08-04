<template>
  <div class="tabs-container">
    <ul class="tab" :class="{ 'tab-block': this.block }">
      <li class="tab-item" v-for="tab in tabs" :class="{ active: tab.isActive }">
        <a
          href="#"
          @click.prevent="selectTab(tab.id)"
          :class="{ 'disabled': tab.disabled }"
        >{{ tab.label }}</a>
      </li>
      <li class="tab-item tab-action" v-if="'action' in $slots">
        <slot name="action"></slot>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  emits: ['change'],
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tabs: [],
      activeTabId: undefined
    }
  },
  mounted () {
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].id);
    }
  },
  methods: {
    findTab(id) {
      return this.tabs.find(tab => tab.id === id);
    },
    selectTab(selectedTabId) {
      const selectedTab = this.findTab(selectedTabId);
      if (!selectedTab || selectedTab.disabled) {
        return;
      }

      this.tabs.forEach(tab => {
        tab.isActive = tab.id === selectedTab.id;
      });

      if (this.activeTabId !== undefined) {
        this.$emit('change', { id: this.activeTabId });
      }
      this.activeTabId = selectedTab.id;
    },
    activeTab () {
      return this.activeTabId;
    }
  }
}
</script>

<style lang="scss">
.tab {
  .tab-item {
    a {
      &.disabled {
        cursor: default;
        opacity: .5;
        pointer-events: none;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style>
