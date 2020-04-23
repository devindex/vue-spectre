const config = {
  locale: 'en',
};

export function initConfig(key, value) {
  if (!(key in config)) {
    config[key] = value;
  }
  return config[key];
}

export function getConfig(key) {
  return key in config ? config[key] : null;
}

export function setConfig(key, value) {
  config[key] = value;
}

export function randomHash() {
  return Math.random().toString(32).slice(-8);
}

export function registerComponent(Vue, name, def) {
  const tagName = `dx${name}`
    .replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
  Vue.component(tagName, def);
}

export function registerComponents(Vue, components = {}) {
  for (const component in components) {
    registerComponent(Vue, component, components[component]);
  }
}
