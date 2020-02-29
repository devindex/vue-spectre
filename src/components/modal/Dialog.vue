<template>
  <base-modal :size="size" :title="title" :show="show" :closable="closable"
              @close="close()" class="modal-dialog">
    <div v-if="html" v-html="html"></div>
    <template slot="footer">
      <div class="modal-buttons">
        <button class="btn btn-sm" v-for="button in availableButtons"
                :class="button.classes ? button.classes : ''"
                @click="click(button.click)">{{ button.label }}</button>
      </div>
    </template>
  </base-modal>
</template>

<script>
  import BaseModal from './Modal.vue';

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
        default: 'sm'
      },
      title: String,
      html: String,
      buttons: Array
    },
    components: {
      BaseModal
    },
    methods: {
      close () {
        this.$emit('close');
      },
      click (cb) {
        cb ? cb(this.close) : this.close();
      },
      defaultButtons () {
        return [{
          label: 'OK',
          classes: {'btn-grey-outline': this.type === 'danger'},
          click: this.close
        }];
      }
    },
    computed: {
      availableButtons () {
        return Array.isArray(this.buttons) ? this.buttons : this.defaultButtons();
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/scss/variables';

  .modal-dialog {
    .modal {
      z-index: $zindex-x;
    }
    .modal-buttons {
      .btn {
        margin-left: $layout-spacing;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
</style>
