import { createApp } from 'vue';
import VueHighlight from 'vue3-highlightjs';
import VueSpectre from '../entry';
import 'spectre.css/dist/spectre.css';
import 'spectre.css/dist/spectre-exp.css';
import 'spectre.css/dist/spectre-icons.css';
import 'highlight.js/styles/atom-one-light.css';
import App from './App.vue';

const app = createApp(App);

app.use(VueSpectre, { locale: 'en' });
app.use(VueHighlight);

app.mount('#app');
