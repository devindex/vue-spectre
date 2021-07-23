<template>
  <ul class="pagination" v-if="totalPages > 1">
    <li class="page-item"
        :class="{disabled: currentPage <= 1}">
      <a href="#" @click.prevent="paginate(currentPage - 1)">Voltar</a>
    </li>

    <li class="page-item" v-for="page in pageNumbers"
        :class="{active: currentPage === page}">
      <a href="#" @click.prevent="paginate(page)">{{ page }}</a>
    </li>

    <li class="page-item"
        :class="{disabled: currentPage === totalPages}">
      <a href="#" @click.prevent="paginate(currentPage + 1)">Avançar</a>
    </li>
  </ul>
</template>

<script>
export default {
  emits: ['paginate'],
  props: {
    total: Number,
    limit: {
      type: Number,
      default: 20
    },
    numbers: {
      type: Number,
      default: 11
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  watch: {
    total () {
      this.currentPage = 1;
    }
  },
  methods: {
    paginate (pageNumber) {
      if (pageNumber <= 0 || pageNumber > this.totalPages) {
        return;
      }

      if (this.currentPage !== pageNumber) {
        this.currentPage = pageNumber;

        this.$emit('paginate', {
          total: this.total,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          pages: this.totalPages,
          page: this.currentPage
        });
      }
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.total / this.limit)
    },
    pageNumbers () {
      const pages = [];

      const half = Math.floor(this.numbers / 2);
      const left = this.currentPage - half;
      const right = this.totalPages - this.currentPage;
      const odd = this.numbers & 1 === 1;

      let start = 1;
      let end = this.totalPages;

      if (this.totalPages > this.numbers) {
        if (left <= (odd ? 1 : 0)) {
          end = start + this.numbers - 1;
        } else if (right < half) {
          start = end - this.numbers + 1;
        } else {
          start = this.currentPage - half + (odd ? 0 : 1);
          end = this.currentPage + half;
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    }
  }
}
</script>
