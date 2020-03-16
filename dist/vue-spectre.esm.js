//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'Autocomplete',
  props: {
    source: {
      type: [Array, Function],
      default: () => []
    },
    value: {
      type: null
    },
    trackBy: {
      type: String
    },
    label: {
      type: String
    },
    customLabel: {
      type: Function,

      default(option, label) {
        if (!option) {
          return '';
        }

        return label ? option[label] : option;
      }

    },
    debounce: {
      type: Number,
      default: 300
    },
    minLen: {
      type: Number,
      default: 3
    },
    inputClass: {
      type: [String, Array, Object]
    },
    highlight: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    internalSearch: {
      type: Boolean,

      default() {
        return typeof this.source !== 'function';
      }

    },
    keepOpen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      search: '',
      isOpen: false,
      cursor: -1,
      direction: '',
      keepSearch: false,
      items: [],
      timeout: null,
      isLoading: false,
      dynamic: typeof this.source === 'function'
    };
  },

  created() {
    this.updateDirection();
    this.setSearch(this.value);
  },

  watch: {
    value(newValue) {
      this.setSearch(newValue);
    }

  },
  methods: {
    activate() {
      this.isOpen = true;
    },

    deactivate() {
      this.isOpen = false;
      this.cursor = -1;
    },

    highlightItem(value) {
      if (this.highlight && typeof value === 'string') {
        return value.replace(new RegExp(this.search.trim(), 'ig'), v => `<b class="highlight">${v}</b>`);
      }

      return value;
    },

    select(item) {
      this.setSearch(item);
      this.$emit('input', item);
      this.$emit('selected', item);
    },

    onInput() {
      this.cursor = -1;
      this.activate();
      this.keepSearch = true;
      this.$emit('input', null);
      this.updateItems();
    },

    onFocus() {
      this.items = [];
      this.updateDirection();
      this.$emit('focus', this.search);
      this.activate();
    },

    onBlur() {
      this.$emit('blur', this.search);
      setTimeout(this.deactivate, 200);
    },

    onKeyUp() {
      if (this.cursor === -1) {
        this.cursor = this.availableItems.length;
      }

      if (this.cursor > 0) {
        this.cursor--;
        this.itemView();
      }
    },

    onKeyDown() {
      if (this.cursor < this.availableItems.length - 1) {
        this.cursor++;
        this.itemView();
      }
    },

    onKeyEnter() {
      if (this.isOpen && this.availableItems[this.cursor]) {
        this.select(this.availableItems[this.cursor]);
        this.isOpen = false;
      }
    },

    itemView() {// TODO
    },

    setSearch(item) {
      if (item || !this.keepSearch) {
        this.keepSearch = false;
        this.search = this.getLabel(item);
      }
    },

    getLabel(item) {
      if (!item) {
        return '';
      }

      return this.customLabel(item, this.label);
    },

    itemClasses(item, i) {
      return {
        'menu-item-active': i === this.cursor,
        'menu-item-selected': this.isSelectedItem(item)
      };
    },

    isSelectedItem(item) {
      if (this.value && item) {
        if (typeof item === 'string') {
          return this.value === item;
        } else if (this.label) {
          return this.value[this.label] === item[this.label];
        }
      }

      return false;
    },

    updateItems() {
      if (!this.dynamic) return;
      this.items = [];
      clearTimeout(this.timeout);
      if (!this.canUpdateItems) return;
      const search = this.search;
      this.timeout = setTimeout(() => this.callSource(search), this.debounce);
    },

    callSource(search) {
      this.isLoading = true;
      Promise.resolve().then(() => this.source(search)).catch(() => []).then(items => {
        this.items = items;
        this.isLoading = false;
      });
    },

    updateDirection() {
      this.$nextTick(() => {
        const {
          top,
          height
        } = this.$el.getBoundingClientRect();
        this.direction = top + height / 2 > window.innerHeight / 2 ? 'top' : 'bottom';
      });
    }

  },
  computed: {
    availableItems() {
      if (this.dynamic) {
        return this.items;
      }

      if (this.internalSearch && this.search) {
        return this.source.filter(item => new RegExp(this.search, 'i').test(this.getLabel(item)));
      }

      return this.source;
    },

    hasItems() {
      return this.availableItems.length > 0;
    },

    canUpdateItems() {
      return this.search.length >= this.minLen;
    },

    canShow() {
      return this.isOpen && this.hasItems || this.keepOpen;
    },

    canShowLoading() {
      return this.loading || this.isLoading;
    },

    inputGroupClasses() {
      return {
        'has-icon-right': this.canShowLoading,
        'input-group': 'action' in this.$slots
      };
    },

    menuStyles() {
      return {
        maxHeight: `${this.maxHeight}px`
      };
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "form-autocomplete"
  }, [_c('form', {
    attrs: {
      "name": "autocomplete",
      "autocomplete": "off"
    },
    on: {
      "submit": function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return _vm.onKeyEnter($event);
      }
    }
  }, [_c('div', {
    class: _vm.inputGroupClasses
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search,
      expression: "search"
    }],
    staticClass: "form-input",
    class: _vm.inputClass,
    attrs: {
      "type": "text",
      "autocomplete": "off",
      "disabled": _vm.disabled,
      "placeholder": _vm.placeholder
    },
    domProps: {
      "value": _vm.search
    },
    on: {
      "input": [function ($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.search = $event.target.value;
      }, _vm.onInput],
      "focus": function ($event) {
        $event.preventDefault();
        return _vm.onFocus($event);
      },
      "blur": function ($event) {
        $event.preventDefault();
        return _vm.onBlur($event);
      },
      "keyup": function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.deactivate($event);
      },
      "keydown": [function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
          return null;
        }

        return _vm.onKeyEnter($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.onKeyDown($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }

        $event.preventDefault();
        return _vm.onKeyUp($event);
      }],
      "keypress": function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }

        $event.preventDefault();
        $event.stopPropagation();
        return _vm.onKeyEnter($event);
      }
    }
  }), _vm._v(" "), _vm.canShowLoading ? _c('i', {
    staticClass: "form-icon loading"
  }) : _vm._e(), _vm._v(" "), _vm._t("action")], 2)]), _vm._v(" "), _vm.canShow ? _c('ul', {
    staticClass: "menu",
    class: this.direction,
    style: _vm.menuStyles
  }, _vm._l(_vm.availableItems, function (item, i) {
    return _c('li', {
      staticClass: "menu-item",
      class: _vm.itemClasses(item, i),
      on: {
        "click": function ($event) {
          return _vm.select(item);
        },
        "mouseover": function ($event) {
          _vm.cursor = i;
        }
      }
    }, [_vm._t("default", [_c('a', {
      domProps: {
        "innerHTML": _vm._s(_vm.highlightItem(_vm.getLabel(item)))
      }
    })], {
      "item": item,
      "search": _vm.search,
      "highlight": _vm.highlightItem,
      "getLabel": _vm.getLabel
    })], 2);
  }), 0) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-64ccc612_0", {
    source: ".form-autocomplete .menu{overflow-y:auto}.form-autocomplete .menu.top{bottom:100%;top:auto;transform:translateY(-.2rem)}.form-autocomplete .loading:not(:last-child){right:1.85rem}.form-autocomplete .menu-item a{cursor:pointer}.form-autocomplete .menu-item-active{background-color:#f1f1fc}.form-autocomplete .highlight{font-weight:700}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
  props: {
    date: Date,
    min: Date,
    max: Date,
    highlights: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      today: this.onlyDate(new Date()),
      month: this.onlyDate(new Date(), true, true),
      days: []
    };
  },

  mounted() {
    this.setMonth(this.date || new Date());
    this.mount();
  },

  watch: {
    date(date) {
      this.setMonth(date);
      this.mount();
    },

    highlights() {
      this.mount();
    }

  },
  methods: {
    reset() {
      this.month = this.onlyDate(this.date, true, true);
      this.mount();
    },

    setMonth(date) {
      this.month = this.onlyDate(date, true, true);
    },

    next() {
      if (this.canNext) {
        this.month.setMonth(this.month.getMonth() + 1);
        this.month = new Date(this.month);
        this.mount();
        this.emitMonthChange('next');
      }
    },

    prev() {
      if (this.canPrev) {
        this.month.setMonth(this.month.getMonth() - 1);
        this.month = new Date(this.month);
        this.mount();
        this.emitMonthChange('prev');
      }
    },

    emitMonthChange(type) {
      this.$emit('month-change', {
        type: type,
        date: this.month,
        dateISO: this.format(this.month)
      });
    },

    select(item) {
      const data = Object.assign({}, item);
      delete data.ctrl;
      this.$emit('select', data);
    },

    mount() {
      this.days = [];
      const calendar = this.onlyDate(this.month, true, true);
      const currMonth = calendar.getMonth();
      const nextMonth = (currMonth + 1) % 12;
      calendar.setDate(calendar.getDay() > 0 ? -(calendar.getDay() - 1) : 1);
      let day;

      do {
        calendar.setHours(12);
        day = {
          ctrl: {
            isEnabled: this.isEnabled(calendar),
            isActiveMonth: calendar.getMonth() === currMonth,
            isHighlight: this.isHighlight(calendar),
            month: 'current'
          },
          weekDay: calendar.getDay(),
          day: calendar.getDate(),
          date: new Date(calendar),
          dateISO: this.format(calendar),
          isToday: this.isToday(calendar),
          isCurrentMonth: calendar.getMonth() === this.today.getMonth()
        };

        if (!day.ctrl.isActiveMonth) {
          day.ctrl.month = calendar.getDate() < 15 ? 'next' : 'prev';
        }

        this.days.push(day);
        calendar.setDate(calendar.getDate() + 1);
      } while (calendar.getMonth() !== nextMonth || this.days.length < 42);
    },

    format(date) {
      return [date.getFullYear(), this.zeroFill(date.getMonth() + 1), this.zeroFill(date.getDate())].join('-');
    },

    zeroFill(value) {
      value = value.toString();
      return value.length < 2 ? '0' + value : value;
    },

    onlyDate(date, asNew = false, resetDay = false) {
      if (asNew) {
        if (typeof date === 'string' && date.length === 10) {
          date += 'T12:00';
        }

        date = new Date(date);
      }

      date.setHours(12);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if (resetDay) {
        date.setDate(1);
      }

      return date;
    },

    isToday(date) {
      return this.today.getTime() === date.getTime();
    },

    isHighlight(date) {
      return this.highlights.some(highlight => this.onlyDate(highlight, true).getTime() === date.getTime());
    },

    isEnabled(date) {
      let enabled = true;

      if (this.min && this.max) {
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime() && this.onlyDate(this.max, true).getTime() >= date.getTime();
      } else if (this.min) {
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime();
      } else if (this.max) {
        enabled = this.onlyDate(this.max, true).getTime() >= date.getTime();
      }

      return enabled;
    },

    isActive(date) {
      if (this.date) {
        return this.onlyDate(this.date, true).getTime() === date.getTime();
      }

      return false;
    },

    dayClasses(day) {
      return {
        disabled: day.ctrl.isEnabled === false || !day.ctrl.isActiveMonth,
        highlight: day.ctrl.isHighlight,
        [day.ctrl.month + '-month']: true
      };
    }

  },
  computed: {
    headerTitle() {
      return this.months[this.month.getMonth()] + ' ' + this.month.getFullYear();
    },

    canPrev() {
      if (this.min) {
        const min = this.onlyDate(this.min, true, true);
        return min.getTime() < this.month.getTime();
      }

      return true;
    },

    canNext() {
      if (this.max) {
        const max = this.onlyDate(this.max, true, true);
        return max.getTime() > this.month.getTime();
      }

      return true;
    }

  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "calendar"
  }, [_c('div', {
    staticClass: "calendar-nav navbar"
  }, [_c('button', {
    staticClass: "btn btn-action btn-link",
    attrs: {
      "disabled": !_vm.canPrev
    },
    on: {
      "click": function ($event) {
        return _vm.prev();
      }
    }
  }, [_c('i', {
    staticClass: "icon icon-arrow-left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "navbar-primary"
  }, [_vm._v(_vm._s(_vm.headerTitle))]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-action btn-link",
    attrs: {
      "disabled": !_vm.canNext
    },
    on: {
      "click": function ($event) {
        return _vm.next();
      }
    }
  }, [_c('i', {
    staticClass: "icon icon-arrow-right"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "calendar-container"
  }, [_c('div', {
    staticClass: "calendar-header"
  }, _vm._l(_vm.daysOfWeek, function (day) {
    return _c('div', {
      staticClass: "calendar-date"
    }, [_vm._v(_vm._s(day))]);
  }), 0), _vm._v(" "), _c('div', {
    staticClass: "calendar-body"
  }, _vm._l(_vm.days, function (day) {
    return _c('div', {
      staticClass: "calendar-date",
      class: _vm.dayClasses(day)
    }, [_c('button', {
      staticClass: "date-item",
      class: {
        'date-today': day.isToday,
        active: _vm.isActive(day.date)
      },
      on: {
        "click": function ($event) {
          return _vm.select(day);
        }
      }
    }, [_vm._v("\n          " + _vm._s(day.day) + "\n        ")])]);
  }), 0)])]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$2 = {
  props: {
    closable: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null
    },
    title: String
  },

  mounted() {
    this.$nextTick(() => {
      document.body.appendChild(this.$el);

      if (this.closable) {
        document.addEventListener('keydown', event => {
          if (this.show && event.keyCode === 27) {
            this.close();
          }
        });
      }
    });
  },

  destroyed() {
    this.$el.remove();
  },

  methods: {
    close() {
      if (this.closable) {
        this.$emit('close');
      }
    }

  },
  computed: {
    classes() {
      const classes = [];

      if (this.size !== null) {
        classes.push(`modal-${this.size}`);
      }

      return classes;
    }

  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('transition', {
    attrs: {
      "name": "modal"
    }
  }, [_vm.show ? _c('div', {
    staticClass: "modal active",
    class: _vm.classes
  }, [_c('div', {
    staticClass: "modal-overlay",
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "modal-container"
  }, [_c('div', {
    staticClass: "modal-header"
  }, [_vm.closable ? _c('button', {
    staticClass: "btn btn-clear float-right",
    on: {
      "click": function ($event) {
        return _vm.close();
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "modal-title"
  }, [_vm._v(_vm._s(_vm.title))])]), _vm._v(" "), _c('div', {
    staticClass: "modal-body"
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    staticClass: "modal-footer"
  }, [_vm._t("footer")], 2)])]) : _vm._e()])], 1);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$3 = {
  props: {
    total: Number,
    limit: {
      type: Number,
      default: 20
    },
    numbers: {
      type: Number,
      default: 11
    }
  },

  data() {
    return {
      currentPage: 1
    };
  },

  watch: {
    total() {
      this.currentPage = 1;
    }

  },
  methods: {
    paginate(pageNumber) {
      if (pageNumber <= 0 || pageNumber > this.totalPages) {
        return;
      }

      if (this.currentPage !== pageNumber) {
        this.currentPage = pageNumber;
        this.$emit('paginate', {
          total: this.total,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit,
          pages: this.totalPages,
          page: this.currentPage
        });
      }
    }

  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },

    pageNumbers() {
      const pages = [];
      const half = Math.floor(this.numbers / 2);
      const left = this.currentPage - half;
      const right = this.totalPages - this.currentPage;
      const odd = this.numbers & 1 === 1;
      let start = 1;
      let end = this.totalPages;

      if (this.totalPages > this.numbers) {
        if (left <= (odd ? 1 : 0)) {
          end = start + this.numbers - 1;
        } else if (right < half) {
          start = end - this.numbers + 1;
        } else {
          start = this.currentPage - half + (odd ? 0 : 1);
          end = this.currentPage + half;
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    }

  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.totalPages > 1 ? _c('ul', {
    staticClass: "pagination"
  }, [_c('li', {
    staticClass: "page-item",
    class: {
      disabled: _vm.currentPage <= 1
    }
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function ($event) {
        $event.preventDefault();
        return _vm.paginate(_vm.currentPage - 1);
      }
    }
  }, [_vm._v("Voltar")])]), _vm._v(" "), _vm._l(_vm.pageNumbers, function (page) {
    return _c('li', {
      staticClass: "page-item",
      class: {
        active: _vm.currentPage === page
      }
    }, [_c('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function ($event) {
          $event.preventDefault();
          return _vm.paginate(page);
        }
      }
    }, [_vm._v(_vm._s(page))])]);
  }), _vm._v(" "), _c('li', {
    staticClass: "page-item",
    class: {
      disabled: _vm.currentPage === _vm.totalPages
    }
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function ($event) {
        $event.preventDefault();
        return _vm.paginate(_vm.currentPage + 1);
      }
    }
  }, [_vm._v("Avançar")])])], 2) : _vm._e();
};

var __vue_staticRenderFns__$3 = [];
/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = undefined;
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
var script$4 = {
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tabs: [],
      activeTabHash: ''
    };
  },

  created() {
    this.tabs = this.$children;
  },

  mounted() {
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash);
    }
  },

  methods: {
    findTab(hash) {
      return this.tabs.find(tab => tab.hash === hash);
    },

    selectTab(selectedTabHash) {
      const selectedTab = this.findTab(selectedTabHash);

      if (!selectedTab) {
        return;
      }

      this.tabs.forEach(tab => {
        tab.isActive = tab.hash === selectedTab.hash;
      });
      this.$emit('changed', {
        tab: selectedTab
      });
      this.activeTabHash = selectedTab.hash;
    },

    activeTab() {
      return this.activeTabHash;
    }

  }
};

/* script */
const __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "tabs-container"
  }, [_c('ul', {
    staticClass: "tab",
    class: {
      'tab-block': this.block
    }
  }, _vm._l(_vm.tabs, function (tab) {
    return _c('li', {
      staticClass: "tab-item",
      class: {
        active: tab.isActive
      }
    }, [_c('a', {
      attrs: {
        "href": "#"
      },
      on: {
        "click": function ($event) {
          $event.preventDefault();
          return _vm.selectTab(tab.hash);
        }
      }
    }, [_vm._v(_vm._s(tab.name))])]);
  }), 0), _vm._v(" "), _vm._t("default")], 2);
};

var __vue_staticRenderFns__$4 = [];
/* style */

const __vue_inject_styles__$4 = function (inject) {
  if (!inject) return;
  inject("data-v-38129b6c_0", {
    source: ".tab .tab-item a:focus{box-shadow:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$4 = undefined;
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, createInjector, undefined, undefined);

//
//
//
//
//
//
var script$5 = {
  props: {
    id: {
      default: null
    },
    name: {
      required: true
    }
  },

  data() {
    return {
      isActive: false
    };
  },

  computed: {
    hash() {
      if (this.id) {
        return this.id;
      } else {
        return this.name.toLowerCase().replace(/ /g, '-');
      }
    }

  }
};

/* script */
const __vue_script__$5 = script$5;
/* template */

var __vue_render__$5 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.isActive,
      expression: "isActive"
    }],
    staticClass: "tab-panel",
    attrs: {
      "aria-hidden": !_vm.isActive,
      "id": _vm.hash,
      "role": "tabpanel"
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$5 = [];
/* style */

const __vue_inject_styles__$5 = undefined;
/* scoped */

const __vue_scope_id__$5 = undefined;
/* module identifier */

const __vue_module_identifier__$5 = undefined;
/* functional template */

const __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$5 = normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);



var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Autocomplete: __vue_component__,
  Calendar: __vue_component__$1,
  Modal: __vue_component__$2,
  Pagination: __vue_component__$3,
  Tabs: __vue_component__$4,
  Tab: __vue_component__$5
});

function registerComponent(Vue, name, def) {
  Vue.component(`dx-${name.toLowerCase()}`, def);
}
function registerComponents(Vue, components = {}) {
  for (const component in components) {
    registerComponent(Vue, component, components[component]);
  }
}

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  registerComponents(Vue, components);
} // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install when vue is found
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
} // Default export is library as a whole, registered via Vue.use()

export default plugin;
export { __vue_component__ as Autocomplete, __vue_component__$1 as Calendar, __vue_component__$2 as Modal, __vue_component__$3 as Pagination, __vue_component__$5 as Tab, __vue_component__$4 as Tabs };