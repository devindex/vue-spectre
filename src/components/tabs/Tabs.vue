<template>
  <div class="tabs-container">
    <ul class="tab" :class="{'tab-block': this.block}">
      <li class="tab-item" v-for="tab in tabs" :class="{active: tab.isActive}">
        <a href="#" @click.prevent="selectTab(tab.hash)">{{ tab.name }}</a>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      block: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        tabs: [],
        activeTabHash: ''
      }
    },
    created () {
      this.tabs = this.$children;
    },
    mounted () {
      if (this.tabs.length) {
        this.selectTab(this.tabs[0].hash);
      }
    },
    methods: {
      findTab(hash) {
        return this.tabs.find(tab => tab.hash === hash);
      },
      selectTab(selectedTabHash) {
        const selectedTab = this.findTab(selectedTabHash);
        if (! selectedTab) {
          return;
        }

        this.tabs.forEach(tab => {
          tab.isActive = (tab.hash === selectedTab.hash);
        });

        this.$emit('changed', { tab: selectedTab });
        this.activeTabHash = selectedTab.hash;
      },
      activeTab () {
        return this.activeTabHash;
      }
    }
  }
</script>

<style lang="scss">
  .tab {
    .tab-item {
      a:focus {
        box-shadow: none;
      }
    }
  }
</style>
