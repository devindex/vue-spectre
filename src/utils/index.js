import { createVNode, render } from "vue";

export function randomHash() {
  return Math.random().toString(32).slice(-8);
}

export function mount(component, args = {}) {
  const {
    props,
    children,
    element,
    app,
  } = args;

  let el = element;

  let vNode = createVNode(component, props, children);

  if (app && app._context) {
    vNode.appContext = app._context;
  }

  if (!el && typeof document !== 'undefined') {
    el = document.createElement('div');
  }

  if (el) {
    render(vNode, el);
  }

  const destroy = () => {
    if (el) {
      render(null, el);
    }
    el = null;
    vNode = null;
  };

  return { vNode, destroy, el };
}
