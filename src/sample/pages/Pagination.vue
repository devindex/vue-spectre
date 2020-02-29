<template>
  <div>
    <dx-pagination
      :total="total"
      :limit="limit"
      :numbers="numbers"
    />

    <pre v-highlightjs="code"><code class="html"></code></pre>

    <p class="mt-2 mb-0 text-gray">Properties</p>
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
        <td>total</td>
        <td>Number</td>
        <td><code>0</code></td>
      </tr>
      <tr>
        <td>limit</td>
        <td>Number</td>
        <td><code>20</code></td>
      </tr>
      <tr>
        <td>numbers</td>
        <td>Number</td>
        <td><code>11</code></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        total: 500,
        limit: 20,
        numbers: 11,
        code: `<dx-pagination :total="total" :limit="limit" :numbers="numbers"></dx-pagination>`,
      }
    }
  }
</script>
