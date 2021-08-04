import { createApp } from 'vue';
import VueHighlight from 'vue3-highlightjs';
import VueSpectre from '../entry';
import 'spectre.css/src/spectre.scss';
import 'spectre.css/src/spectre-exp.scss';
import 'spectre.css/src/spectre-icons.scss';
import 'highlight.js/styles/atom-one-light.css';
import App from './App.vue';
import SampleCode from '@/sample/components/SampleCode.vue';

const app = createApp(App);

app.use(VueSpectre, { locale: 'en' });
app.use(VueHighlight);

app.component('sample-code', SampleCode);

app.mount('#app');
