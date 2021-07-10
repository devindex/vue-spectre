// Import vue components
import * as components from '@/components/index';
import { init, getPrefix } from './config';

// install function executed by Vue.use()
const install = function installPlugin(app, options = {}) {
  init(options);

  const prefix = getPrefix();

  for (const component in components) {
    const tagName = `${prefix}${component}`
      .replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    app.component(tagName, components[component]);
  }
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/components/index';
