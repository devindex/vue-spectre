import * as components from 'src/components/index';
import { registerComponents, setConfig } from './utils';

// install function executed by Vue.use()
function install(Vue, params = {}) {
  params = { ...params };
  if (install.installed) return;
  install.installed = true;
  registerComponents(Vue, components);

  if ('locale' in params) {
    setConfig('locale', params.locale);
  }
}

// Create module definition for Vue.use()
const plugin = {
  install,
};

// To auto-install when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Default export is library as a whole, registered via Vue.use()
export default plugin;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from 'src/components/index';
