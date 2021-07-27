<template>
  <h3 class="s-title">Pagination</h3>

  <dx-pagination
    :total="total"
    :limit="limit"
    :numbers="numbers"
  ></dx-pagination>

  <sample-code :code="code"></sample-code>
</template>

<script>
export default {
  data() {
    return {
      total: 500,
      limit: 20,
      numbers: 11,
      code: `<dx-pagination
    :total="total"
    :limit="limit"
    :numbers="numbers"
></dx-pagination>`,
    };
  },
}
</script>
