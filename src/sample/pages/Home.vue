<template>
  <h3 class="s-title">Spectre.css - Vue 3</h3>

  <sample-code :code="installCode" lang="bash" title="Installation"></sample-code>
  <sample-code :code="usageCode" lang="js" title="Usage"></sample-code>
</template>

<script>
const installCode = `# npm
npm i -S spectre.css @devindex/vue-spectre

# yarn
yarn add spectre.css @devindex/vue-spectre`;

const usageCode = `import { createApp } from 'vue';
import VueSpectre from '@devindex/vue-spectre'; // <-- ADD THIS LINE
import App from './App.vue';
import 'spectre.css/dist/spectre.css';

const app = createApp(App);

app.use(VueSpectre, { locale: 'en' });  // <-- ADD THIS LINE

app.mount('#app');`;

export default {
  data() {
    return {
      installCode,
      usageCode,
    };
  },
}
</script>
