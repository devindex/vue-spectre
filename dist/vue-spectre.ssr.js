'use strict';Object.defineProperty(exports,'__esModule',{value:true});//
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
      default: function _default() {
        return [];
      }
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
      default: function _default(option, label) {
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
    inputId: {
      type: String
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
      default: function _default() {
        return typeof this.source !== 'function';
      }
    },
    keepOpen: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
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
  created: function created() {
    this.updateDirection();
    this.setSearch(this.value);
  },
  watch: {
    value: function value(newValue) {
      this.setSearch(newValue);
    }
  },
  methods: {
    activate: function activate() {
      this.isOpen = true;
    },
    deactivate: function deactivate() {
      this.isOpen = false;
      this.cursor = -1;
    },
    highlightItem: function highlightItem(value) {
      if (this.highlight && typeof value === 'string') {
        return value.replace(new RegExp(this.search.trim(), 'ig'), function (v) {
          return "<b class=\"highlight\">".concat(v, "</b>");
        });
      }

      return value;
    },
    select: function select(item) {
      var _this = this;

      this.setSearch(item);
      this.$emit('input', item);
      this.$nextTick(function () {
        _this.$emit('select', item);
      });
    },
    onInput: function onInput() {
      this.cursor = -1;
      this.activate();
      this.keepSearch = true;
      this.$emit('input', null);
      this.updateItems();
    },
    onFocus: function onFocus() {
      this.items = [];
      this.updateDirection();
      this.$emit('focus', this.search);
      this.activate();
    },
    onBlur: function onBlur() {
      this.$emit('blur', this.search);
      setTimeout(this.deactivate, 200);
    },
    onKeyUp: function onKeyUp() {
      if (this.cursor === -1) {
        this.cursor = this.availableItems.length;
      }

      if (this.cursor > 0) {
        this.cursor--;
        this.itemView();
      }
    },
    onKeyDown: function onKeyDown() {
      if (this.cursor < this.availableItems.length - 1) {
        this.cursor++;
        this.itemView();
      }
    },
    onKeyEnter: function onKeyEnter() {
      if (this.isOpen && this.availableItems[this.cursor]) {
        this.select(this.availableItems[this.cursor]);
        this.isOpen = false;
      }
    },
    itemView: function itemView() {// TODO
    },
    setSearch: function setSearch(item) {
      if (item || !this.keepSearch) {
        this.keepSearch = false;
        this.search = this.getLabel(item);
      }
    },
    getLabel: function getLabel(item) {
      if (!item) {
        return '';
      }

      return this.customLabel(item, this.label);
    },
    itemClasses: function itemClasses(item, i) {
      return {
        'menu-item-active': i === this.cursor,
        'menu-item-selected': this.isSelectedItem(item)
      };
    },
    isSelectedItem: function isSelectedItem(item) {
      if (this.value && item) {
        if (typeof item === 'string') {
          return this.value === item;
        } else if (this.label) {
          return this.value[this.label] === item[this.label];
        }
      }

      return false;
    },
    updateItems: function updateItems() {
      var _this2 = this;

      if (!this.dynamic) return;
      this.items = [];
      clearTimeout(this.timeout);
      if (!this.canUpdateItems) return;
      var search = this.search;
      this.timeout = setTimeout(function () {
        return _this2.callSource(search);
      }, this.debounce);
    },
    callSource: function callSource(search) {
      var _this3 = this;

      this.isLoading = true;
      Promise.resolve().then(function () {
        return _this3.source(search);
      }).catch(function () {
        return [];
      }).then(function (items) {
        _this3.items = items;
        _this3.isLoading = false;
      });
    },
    updateDirection: function updateDirection() {
      var _this4 = this;

      this.$nextTick(function () {
        var _this4$$el$getBoundin = _this4.$el.getBoundingClientRect(),
            top = _this4$$el$getBoundin.top,
            height = _this4$$el$getBoundin.height;

        _this4.direction = top + height / 2 > window.innerHeight / 2 ? 'top' : 'bottom';
      });
    }
  },
  computed: {
    availableItems: function availableItems() {
      var _this5 = this;

      if (this.dynamic) {
        return this.items;
      }

      if (this.internalSearch && this.search) {
        return this.source.filter(function (item) {
          return new RegExp(_this5.search, 'i').test(_this5.getLabel(item));
        });
      }

      return this.source;
    },
    hasItems: function hasItems() {
      return this.availableItems.length > 0;
    },
    canUpdateItems: function canUpdateItems() {
      return this.search.length >= this.minLen;
    },
    canShow: function canShow() {
      return this.isOpen && this.hasItems || this.keepOpen;
    },
    canShowLoading: function canShowLoading() {
      return this.loading || this.isLoading;
    },
    inputGroupClasses: function inputGroupClasses() {
      return {
        'has-icon-right': this.canShowLoading,
        'input-group': 'action' in this.$slots
      };
    },
    menuStyles: function menuStyles() {
      return {
        maxHeight: "".concat(this.maxHeight, "px")
      };
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "form-autocomplete"
  }, [_vm._ssrNode("<form name=\"autocomplete\" autocomplete=\"off\">", "</form>", [_vm._ssrNode("<div" + _vm._ssrClass(null, _vm.inputGroupClasses) + ">", "</div>", [_vm._ssrNode("<input type=\"text\" autocomplete=\"off\"" + _vm._ssrAttr("id", _vm.inputId) + _vm._ssrAttr("disabled", _vm.disabled) + _vm._ssrAttr("placeholder", _vm.placeholder) + _vm._ssrAttr("value", _vm.search) + _vm._ssrClass("form-input", _vm.inputClass) + "> " + (_vm.canShowLoading ? "<i class=\"form-icon loading\"></i>" : "<!---->") + " "), _vm._t("action")], 2)]), _vm._ssrNode(" "), _vm.canShow ? _vm._ssrNode("<ul" + _vm._ssrClass("menu", this.direction) + _vm._ssrStyle(null, _vm.menuStyles, null) + ">", "</ul>", _vm._l(_vm.availableItems, function (item, i) {
    return _vm._ssrNode("<li" + _vm._ssrClass("menu-item", _vm.itemClasses(item, i)) + ">", "</li>", [_vm._t("default", [_c('a', {
      domProps: {
        "innerHTML": _vm._s(_vm.highlightItem(_vm.getLabel(item)))
      }
    })], {
      "item": item,
      "search": _vm.search,
      "highlight": _vm.highlightItem,
      "getLabel": _vm.getLabel
    })], 2);
  }), 0) : _vm._e()], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-064e1050_0", {
    source: ".form-autocomplete .menu{overflow-y:auto}.form-autocomplete .menu.top{bottom:100%;top:auto;transform:translateY(-.2rem)}.form-autocomplete .loading:not(:last-child){right:1.85rem}.form-autocomplete .menu-item a{cursor:pointer}.form-autocomplete .menu-item-active{background-color:#f1f1fc}.form-autocomplete .highlight{font-weight:700}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-064e1050";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}//
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
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      today: this.onlyDate(new Date()),
      month: this.onlyDate(new Date(), true, true),
      days: []
    };
  },
  mounted: function mounted() {
    this.setMonth(this.date || new Date());
    this.mount();
  },
  watch: {
    date: function date(_date) {
      this.setMonth(_date);
      this.mount();
    },
    highlights: function highlights() {
      this.mount();
    }
  },
  methods: {
    reset: function reset() {
      this.month = this.onlyDate(this.date, true, true);
      this.mount();
    },
    setMonth: function setMonth(date) {
      this.month = this.onlyDate(date, true, true);
    },
    next: function next() {
      if (this.canNext) {
        this.month.setMonth(this.month.getMonth() + 1);
        this.month = new Date(this.month);
        this.mount();
        this.emitMonthChange('next');
      }
    },
    prev: function prev() {
      if (this.canPrev) {
        this.month.setMonth(this.month.getMonth() - 1);
        this.month = new Date(this.month);
        this.mount();
        this.emitMonthChange('prev');
      }
    },
    emitMonthChange: function emitMonthChange(type) {
      this.$emit('month-change', {
        type: type,
        date: this.month,
        dateISO: this.format(this.month)
      });
    },
    select: function select(item) {
      var data = Object.assign({}, item);
      delete data.ctrl;
      this.$emit('select', data);
    },
    mount: function mount() {
      this.days = [];
      var calendar = this.onlyDate(this.month, true, true);
      var currMonth = calendar.getMonth();
      var nextMonth = (currMonth + 1) % 12;
      calendar.setDate(calendar.getDay() > 0 ? -(calendar.getDay() - 1) : 1);
      var day;

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
    format: function format(date) {
      return [date.getFullYear(), this.zeroFill(date.getMonth() + 1), this.zeroFill(date.getDate())].join('-');
    },
    zeroFill: function zeroFill(value) {
      value = value.toString();
      return value.length < 2 ? '0' + value : value;
    },
    onlyDate: function onlyDate(date) {
      var asNew = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var resetDay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
    isToday: function isToday(date) {
      return this.today.getTime() === date.getTime();
    },
    isHighlight: function isHighlight(date) {
      var _this = this;

      return this.highlights.some(function (highlight) {
        return _this.onlyDate(highlight, true).getTime() === date.getTime();
      });
    },
    isEnabled: function isEnabled(date) {
      var enabled = true;

      if (this.min && this.max) {
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime() && this.onlyDate(this.max, true).getTime() >= date.getTime();
      } else if (this.min) {
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime();
      } else if (this.max) {
        enabled = this.onlyDate(this.max, true).getTime() >= date.getTime();
      }

      return enabled;
    },
    isActive: function isActive(date) {
      if (this.date) {
        return this.onlyDate(this.date, true).getTime() === date.getTime();
      }

      return false;
    },
    dayClasses: function dayClasses(day) {
      return _defineProperty({
        disabled: day.ctrl.isEnabled === false || !day.ctrl.isActiveMonth,
        highlight: day.ctrl.isHighlight
      }, day.ctrl.month + '-month', true);
    }
  },
  computed: {
    headerTitle: function headerTitle() {
      return this.months[this.month.getMonth()] + ' ' + this.month.getFullYear();
    },
    canPrev: function canPrev() {
      if (this.min) {
        var min = this.onlyDate(this.min, true, true);
        return min.getTime() < this.month.getTime();
      }

      return true;
    },
    canNext: function canNext() {
      if (this.max) {
        var max = this.onlyDate(this.max, true, true);
        return max.getTime() > this.month.getTime();
      }

      return true;
    }
  }
};/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "calendar"
  }, [_vm._ssrNode("<div class=\"calendar-nav navbar\"><button" + _vm._ssrAttr("disabled", !_vm.canPrev) + " class=\"btn btn-action btn-link\"><i class=\"icon icon-arrow-left\"></i></button> <div class=\"navbar-primary\">" + _vm._ssrEscape(_vm._s(_vm.headerTitle)) + "</div> <button" + _vm._ssrAttr("disabled", !_vm.canNext) + " class=\"btn btn-action btn-link\"><i class=\"icon icon-arrow-right\"></i></button></div> <div class=\"calendar-container\"><div class=\"calendar-header\">" + _vm._ssrList(_vm.daysOfWeek, function (day) {
    return "<div class=\"calendar-date\">" + _vm._ssrEscape(_vm._s(day)) + "</div>";
  }) + "</div> <div class=\"calendar-body\">" + _vm._ssrList(_vm.days, function (day) {
    return "<div" + _vm._ssrClass("calendar-date", _vm.dayClasses(day)) + "><button" + _vm._ssrClass("date-item", {
      'date-today': day.isToday,
      active: _vm.isActive(day.date)
    }) + ">" + _vm._ssrEscape("\n          " + _vm._s(day.day) + "\n        ") + "</button></div>";
  }) + "</div></div>")]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = "data-v-5d88f181";
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);//
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
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      document.body.appendChild(_this.$el);

      if (_this.closable) {
        document.addEventListener('keydown', function (event) {
          if (_this.show && event.keyCode === 27) {
            _this.close();
          }
        });
      }
    });
  },
  destroyed: function destroyed() {
    this.$el.remove();
  },
  methods: {
    close: function close() {
      if (this.closable) {
        this.$emit('close');
      }
    }
  },
  computed: {
    classes: function classes() {
      var classes = [];

      if (this.size !== null) {
        classes.push("modal-".concat(this.size));
      }

      return classes;
    }
  }
};/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
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
      "click": function click($event) {
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
      "click": function click($event) {
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

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = "data-v-9bea744e";
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      currentPage: 1
    };
  },
  watch: {
    total: function total() {
      this.currentPage = 1;
    }
  },
  methods: {
    paginate: function paginate(pageNumber) {
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
    totalPages: function totalPages() {
      return Math.ceil(this.total / this.limit);
    },
    pageNumbers: function pageNumbers() {
      var pages = [];
      var half = Math.floor(this.numbers / 2);
      var left = this.currentPage - half;
      var right = this.totalPages - this.currentPage;
      var odd = this.numbers & 1 === 1;
      var start = 1;
      var end = this.totalPages;

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

      for (var i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    }
  }
};/* script */
var __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.totalPages > 1 ? _c('ul', {
    staticClass: "pagination"
  }, [_vm._ssrNode("<li" + _vm._ssrClass("page-item", {
    disabled: _vm.currentPage <= 1
  }) + "><a href=\"#\">Voltar</a></li> " + _vm._ssrList(_vm.pageNumbers, function (page) {
    return "<li" + _vm._ssrClass("page-item", {
      active: _vm.currentPage === page
    }) + "><a href=\"#\">" + _vm._ssrEscape(_vm._s(page)) + "</a></li>";
  }) + " <li" + _vm._ssrClass("page-item", {
    disabled: _vm.currentPage === _vm.totalPages
  }) + "><a href=\"#\">Avançar</a></li>")]) : _vm._e();
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = "data-v-b49cf4a6";
/* functional template */

var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);//
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
  data: function data() {
    return {
      tabs: [],
      activeTabHash: ''
    };
  },
  created: function created() {
    this.tabs = this.$children;
  },
  mounted: function mounted() {
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash);
    }
  },
  methods: {
    findTab: function findTab(hash) {
      return this.tabs.find(function (tab) {
        return tab.hash === hash;
      });
    },
    selectTab: function selectTab(selectedTabHash) {
      var selectedTab = this.findTab(selectedTabHash);

      if (!selectedTab) {
        return;
      }

      this.tabs.forEach(function (tab) {
        tab.isActive = tab.hash === selectedTab.hash;
      });
      this.$emit('change', {
        tab: selectedTab
      });
      this.activeTabHash = selectedTab.hash;
    },
    activeTab: function activeTab() {
      return this.activeTabHash;
    }
  }
};/* script */
var __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "tabs-container"
  }, [_vm._ssrNode("<ul" + _vm._ssrClass("tab", {
    'tab-block': this.block
  }) + ">" + _vm._ssrList(_vm.tabs, function (tab) {
    return "<li" + _vm._ssrClass("tab-item", {
      active: tab.isActive
    }) + "><a href=\"#\">" + _vm._ssrEscape(_vm._s(tab.name)) + "</a></li>";
  }) + "</ul> "), _vm._t("default")], 2);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$4 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-97753820_0", {
    source: ".tab .tab-item a:focus{box-shadow:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = "data-v-97753820";
/* functional template */

var __vue_is_functional_template__$4 = false;
/* style inject shadow dom */

var __vue_component__$4 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, createInjectorSSR, undefined);//
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
  data: function data() {
    return {
      isActive: false
    };
  },
  computed: {
    hash: function hash() {
      if (this.id) {
        return this.id;
      } else {
        return this.name.toLowerCase().replace(/ /g, '-');
      }
    }
  }
};/* script */
var __vue_script__$5 = script$5;
/* template */

var __vue_render__$5 = function __vue_render__() {
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

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = "data-v-536c3377";
/* functional template */

var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);var components=/*#__PURE__*/Object.freeze({__proto__:null,Autocomplete: __vue_component__,Calendar: __vue_component__$1,Modal: __vue_component__$2,Pagination: __vue_component__$3,Tabs: __vue_component__$4,Tab: __vue_component__$5});function registerComponent(Vue, name, def) {
  Vue.component("dx-".concat(name.toLowerCase()), def);
}
function registerComponents(Vue) {
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  for (var component in components) {
    registerComponent(Vue, component, components[component]);
  }
}function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  registerComponents(Vue, components);
} // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Default export is library as a whole, registered via Vue.use()
exports.Autocomplete=__vue_component__;exports.Calendar=__vue_component__$1;exports.Modal=__vue_component__$2;exports.Pagination=__vue_component__$3;exports.Tab=__vue_component__$5;exports.Tabs=__vue_component__$4;exports.default=plugin;