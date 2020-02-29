<template>
  <div>
    <button class="btn btn-primary" @click="show = true">Show modal</button>
    <dx-modal :show="show" title="Modal" @close="show = false">
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
        <button class="btn btn-primary" @click="show = false">Close</button>
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
        <td>code</td>
        <td>Boolean</td>
        <td><code>false</code></td>
      </tr>
      <tr>
        <td>title</td>
        <td>String</td>
        <td><code>""</code></td>
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
        show: false,
      }
    }
  }
</script>
