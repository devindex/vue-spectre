<template>
  <div>
    <button class="btn btn-primary" @click="show1 = true">Show modal</button>

    <dx-modal :show="show1" title="Modal" @close="show1 = false">
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
      <template slot="footer">
        <button class="btn mr-2" @click="show2 = true">Open another modal</button>
        <button class="btn btn-primary" @click="show1 = false">Close</button>
      </template>
    </dx-modal>

    <dx-modal :show="show2" title="Another modal" @close="show2 = false" size="sm">
      <p class="mb-0">
        Per aumento de cachacis, eu reclamis. Admodum accumsan disputationi eu sit.
        Vide electram sadipscing et per. Detraxit consequat et quo num tendi nada.
        In elementis mé pra quem é amistosis quis leo.
      </p>
      <template slot="footer">
        <button class="btn btn-primary" @click="show2 = false">Ok</button>
      </template>
    </dx-modal>

    <h3 class="h5 mt-2 mb-0">Properties</h3>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Default</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>show</td>
        <td>Boolean</td>
        <td><code>false</code></td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td><code>""</code></td>
      </tr>
      <tr>
        <td>closable</td>
        <td>Boolean</td>
        <td><code>true</code></td>
      </tr>
      <tr>
        <td>size</td>
        <td>String</td>
        <td><code>md</code></td>
      </tr>
      <tr>
        <td>click-to-close</td>
        <td>Boolean</td>
        <td><code>false</code></td>
      </tr>
      </tbody>
    </table>

    <h3 class="h5 mt-2 mb-0">Events</h3>
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Name</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>close</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show1: false,
        show2: false,
      }
    }
  }
</script>
