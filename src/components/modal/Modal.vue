<template>
  <div>
    <transition name="modal">
      <div class="modal active" v-if="show" :class="classes">
        <div class="modal-overlay" @click="close()"></div>
        <div class="modal-container">
          <div class="modal-header">
            <button class="btn btn-clear float-right" v-if="closable" @click="close()"></button>
            <div class="modal-title">{{ title }}</div>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      closable: {
        type: Boolean,
        default: true,
      },
      show: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: null
      },
      title: String
    },
    mounted () {
      this.$nextTick(() => {
        document.body.appendChild(this.$el);

        if (this.closable) {
          document.addEventListener('keydown', event => {
            if (this.show && event.keyCode === 27) {
              this.close();
            }
          });
        }
      })
    },
    destroyed () {
      this.$el.remove();
    },
    methods: {
      close () {
        if (this.closable) {
          this.$emit('close');
        }
      }
    },
    computed: {
      classes () {
        const classes = [];

        if (this.size !== null) {
          classes.push(`modal-${this.size}`)
        }

        return classes;
      }
    }
  }
</script>

<!--<style lang="scss">-->
<!--  @import '~assets/scss/variables';-->

<!--  .modal {-->
<!--    &.modal-enter,-->
<!--    &.modal-leave-active {-->
<!--      opacity: 0;-->
<!--      transform: scale(1.1);-->
<!--    }-->
<!--    .modal-container {-->
<!--      min-width: 20rem;-->
<!--    }-->
<!--    &.modal-md {-->
<!--      .modal-container {-->
<!--        min-width: 35rem;-->
<!--      }-->
<!--    }-->
<!--    &.modal-lg {-->
<!--      .modal-container {-->
<!--        @media screen and (min-width: 1024px) {-->
<!--          min-width: 50rem;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .modal-body {-->
<!--      max-height: 80vh;-->
<!--    }-->
<!--  }-->
<!--</style>-->
