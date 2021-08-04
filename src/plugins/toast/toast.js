import Toast from '@/components/toast/Toast';
import { mount } from '@/utils';

let appInstance;
let toast;
let timeout;

function close() {
  if (!!toast) {
    toast.destroy();
  }
  clearTimeout(timeout);
}

function show(content, options = {}) {
  options = {
    type: null,
    timeout: 5, // seconds
    ...options,
  };

  close();

  toast = mount(Toast, {
    props: {
      show: true,
      content: content,
      type: options.type,
    },
    app: appInstance,
  });

  if (options.timeout) {
    clearTimeout(timeout);
    timeout = setTimeout(close, options.timeout * 1000);
  }
}

function primary(content, options = {}) {
  return show(content, { ...options, type: 'primary' });
}

function success(content, options = {}) {
  return show(content, { ...options, type: 'success' });
}

function warning(content, options = {}) {
  return show(content, { ...options, type: 'warning' });
}

function error(content, options = {}) {
  return show(content, { ...options, type: 'error' });
}

function info(content, options = {}) {
  return show(content, { ...options, type: 'info' });
}

export default function setup(app) {
  appInstance = app;

  app.config.globalProperties.$toast = {
    show,
    primary,
    success,
    warning,
    error,
    info,
    close,
  };
};
