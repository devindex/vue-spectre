import Vue from 'vue';
import VueHighlight from 'vue-highlightjs';
import App from './App';
import VueSpectre from '../entry';
import 'spectre.css/dist/spectre.css';
import 'spectre.css/dist/spectre-exp.css';
import 'spectre.css/dist/spectre-icons.css';
import 'highlight.js/styles/atom-one-light.css';

Vue.config.productionTip = false;
Vue.use(VueHighlight);
Vue.use(VueSpectre, { locale: 'en' });

new Vue({
  render: (h) => h(App),
}).$mount('#app');
