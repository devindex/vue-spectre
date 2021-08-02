<template>
  <h3 class="s-title">Modal</h3>

  <section class="component-section">
    <h4 class="section-title">Basic</h4>

    <button class="btn btn-primary" @click="item1.value = true">Open modal</button>

    <dx-modal v-model="item1.value" title="Modal">
      <p class="mb-0">
        Mussum Ipsum, cacilds vidis litro abertis. Si u mundo tá muito paradis?
        Toma um mé que o mundo vai girarzis! Detraxit consequat et quo num tendi nada.
        Sapien in monti palavris qui num significa nadis i pareci latim.
        Mais vale um bebadis conhecidiss, que um alcoolatra anonimis.
      </p>

      <template v-slot:footer>
        <button class="btn btn-primary" @click="item1.value = false">Close</button>
      </template>
    </dx-modal>

    <sample-code :code="item1.code"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Advanced</h4>

    <button class="btn btn-primary" @click="item2.value = true">Open modal</button>

    <dx-modal v-model="item2.value" id="my-custom-id">
      <template v-slot:header>
        <div class="header-title">
          <span class="text-primary">Modal</span>
          <small class="text-gray"> (with custom header)</small>
        </div>
      </template>

      <p>
        Mussum Ipsum, cacilds vidis litro abertis. Si u mundo tá muito paradis?
        Toma um mé que o mundo vai girarzis! Detraxit consequat et quo num tendi nada.
        Sapien in monti palavris qui num significa nadis i pareci latim.
        Mais vale um bebadis conhecidiss, que um alcoolatra anonimis.
      </p>
      <p class="mb-0">
        Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis.
        Praesent vel viverra nisi. Mauris aliquet nunc non turpis scelerisque, eget.
        In elementis mé pra quem é amistosis quis leo. Admodum accumsan disputationi
        eu sit. Vide electram sadipscing et per.
      </p>

      <template v-slot:footer>
        <button class="btn btn-error mr-2" @click="item2.value2 = true">Remove</button>
        <button class="btn btn-primary" @click="item2.value = false">Close</button>
      </template>
    </dx-modal>

    <dx-modal v-model="item2.value2" size="sm" :closable="false">
      <div class="text-center pt-2 pb-2">
        <p class="mt-0 text-bold">
          Do you really want to remove this?
        </p>
        <button class="btn mr-2" @click="item2.value2 = false">Cancel</button>
        <button class="btn btn-error" @click="closeAll">Confirm</button>
      </div>
    </dx-modal>

    <sample-code :code="item2.code"></sample-code>
  </section>
</template>

<script>
const code1 = `<button class="btn" @click="value=true">Open modal</button>

<dx-modal v-model="value" title="Modal">
  Content here...

  <template v-slot:footer>
    <button class="btn" @click="value=false">Close</button>
  </template>
</dx-modal>`;

const code2 = `<button class="btn" @click="value=true">Open modal</button>

<dx-modal v-model="value" id="my-custom-id">
  <template v-slot:header>
    <div class="header-title">
      <span class="text-primary">Modal</span>
      <small class="text-gray"> (with custom header)</small>
    </div>
  </template>

  Content here...

  <template v-slot:footer>
    <button class="btn" @click="value=false">Close</button>
  </template>
</dx-modal>`;

export default {
  data() {
    return {
      item1: {
        value: false,
        code: code1,
      },
      item2: {
        value: false,
        value2: false,
        code: code2,
      },
    };
  },
  methods: {
    closeAll() {
      this.item1.value = false;
      this.item2.value = false;
      this.item2.value2 = false;
    },
  },
}
</script>
