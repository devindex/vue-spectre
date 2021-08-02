<template>
  <div class="off-canvas off-canvas-sidebar-show">
    <div class="off-canvas-sidebar">
      <div class="sidebar-content">
        <h1 class="h3">Elements</h1>
        <a
          class="menu-item"
          v-for="page in pages"
          :href="page.path"
          @click.prevent="routeTo(page.path)"
        >{{ page.name }}</a>
      </div>
    </div>

    <div class="off-canvas-content">
      <div class="main-content">
        <component v-if="currentPage" :is="currentPage.component" />
        <template v-else>
          <h2 class="h4">Not found</h2>

          <div>Page not found</div>
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
      currentRoute: window.location.pathname,
      pages,
    }
  },
  mounted() {
    window.onpopstate = () => {
      this.currentRoute = window.location.pathname;
    };
  },
  computed: {
    currentPage() {
      return pages.find(({ path }) => path === this.currentRoute);
    },
  },
  methods: {
    routeTo(path) {
      this.currentRoute = path;
      window.history.pushState({}, '', path);
    },
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
.off-canvas {
  .off-canvas-content {
    overflow-y: auto;
    padding: 0;
  }
}
.main-content {
  max-width: $size-md;
  padding: 0 $layout-spacing-lg $layout-spacing-lg $layout-spacing-lg;
  margin: 0 auto;
  .page-content {
    padding-bottom: $control-size-lg * 2;
  }
  .s-title {
    background-color: $light-color;
    border-bottom: $border-width solid $gray-color-light;
    line-height: 1.8rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    position: sticky;
    top: 0;
    z-index: 99;
  }
  .component-section {
    margin-bottom: $unit-16;
    .section-title {
      color: $primary-color-dark;
      font-size: $font-size-lg;
      font-weight: normal;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
