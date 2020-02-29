<template>
  <div class="dropdown">
    <a class="dropdown-trigger" :class="{'dropdown-toggle': active}"
       @click="active = !active" @blur="active = false" tabindex="0">
      <slot name="trigger">
        <span>
<!--          <fa-icon :icon="['fal', 'bars']" class="icon-default text-dark"></fa-icon>-->
        </span>
      </slot>
    </a>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Dropdown',
    data () {
      return {
        active: false
      }
    }
  }
</script>

<!--<style lang="scss">-->
<!--  @import '~assets/scss/variables';-->

<!--  .dropdown {-->
<!--    .dropdown-trigger {-->
<!--      cursor: pointer;-->
<!--      display: inline-block;-->
<!--      span {-->
<!--        border-radius: $border-radius;-->
<!--        display: inline-block;-->
<!--        margin: 0;-->
<!--        padding: .2rem $layout-spacing;-->
<!--        &.btn {-->
<!--          display: inline-flex;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .menu-item {-->
<!--      a {-->
<!--        transition: all .1s ease;-->
<!--      }-->
<!--      a:hover {-->
<!--        color: $light-color;-->
<!--      }-->
<!--      a.has-icon {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        svg {-->
<!--          margin-right: $layout-spacing;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
