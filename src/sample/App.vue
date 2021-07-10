<template>
  <div id="app" class="off-canvas off-canvas-sidebar-show">
    <div class="off-canvas-sidebar">
      <div class="sidebar-content">
        <h1 class="h3">Elements</h1>
        <a
          class="menu-item"
          v-for="page in pages"
          :href="`#${page.id}`"
        >{{ page.name }}</a>
      </div>
    </div>
    <div class="off-canvas-content">
      <div class="main-content">
        <template v-for="{ name, component, id } in pages">
          <div class="page-content" v-if="component" :id="id">
            <h2 class="h4">{{ name }}</h2>
            <component :is="component" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import pages from './pages';

export default {
  data() {
    return {
      pages: pages,
    }
  },
};
</script>

<style lang="scss">
@import '~spectre.css/src/variables';

#app {
  height: 100vh;
}
.sidebar-content {
  padding: $layout-spacing-lg;
}
.sidebar-content .menu-item {
  display: block;
  padding: $layout-spacing-sm 0;
}
.off-canvas-content {
  overflow-y: auto;
}
.main-content {
  max-width: $size-md;
  padding: $layout-spacing-lg 0;
  .page-content {
    padding-bottom: $control-size-lg * 2;
  }
}
</style>
