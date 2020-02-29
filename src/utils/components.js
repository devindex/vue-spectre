export function registerComponent(Vue, name, def) {
  Vue.component(`dx-${name.toLowerCase()}`, def);
}

export function registerComponents(Vue, components = {}) {
  for (const component in components) {
    registerComponent(Vue, component, components[component]);
  }
}
