<template>
  <h3 class="s-title">Toast plugin</h3>

  <section class="component-section">
    <h4 class="section-title">Basic</h4>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.show('Toast default')"
    >Toast default</button>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.primary('Toast primary')"
    >Toast primary</button>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.success('Toast success')"
    >Toast success</button>
    <button
      class="btn btn-primary mr-2"
      @click="$toast.warning('Toast warning')"
    >Toast warning</button>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.error('Toast error')"
    >Toast error</button>

    <sample-code :code="code1"></sample-code>
  </section>

  <section class="component-section">
    <h4 class="section-title">Advanced plugin</h4>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.primary({ title: 'Title', message: longMessage })"
    >Toast with title</button>

    <button
      class="btn btn-primary mr-2"
      @click="$toast.primary('Closes in 10s', { timeout: 10 })"
    >Toast with 10s timeout</button>

    <sample-code :code="code2"></sample-code>
  </section>

</template>

<script>
const code1 = `<button
  @click="$toast.show('Toast default')"
  class="btn btn-primary"
>Toast default</button>

<button
  @click="$toast.primary('Toast primary')"
  class="btn btn-primary"
>Toast primary</button>

<button
  @click="$toast.success('Toast success')"
  class="btn btn-primary"
>Toast success</button>

<button
  @click="$toast.warning('Toast warning')"
  class="btn btn-primary"
>Toast warning</button>

<button
  @click="$toast.error('Toast error')"
  class="btn btn-primary"
>Toast error</button>`;

const code2 = `<button
  @click="$toast.primary({ title: 'Title', message: 'Lorem ipsum...' })"
  class="btn btn-primary mr-2"
>Toast with title</button>

<button
  @click="$toast.primary('Closes in 10s', { timeout: 10 })"
  class="btn btn-primary mr-2"
>Toast with 10s timeout</button>`;

export default {
  data() {
    return {
      code1,
      code2,
      longMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    };
  },
  methods: {
  },
}
</script>
