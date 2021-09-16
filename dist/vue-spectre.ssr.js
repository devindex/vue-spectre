'use strict';var vue=require('vue');function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
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
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var script$9 = {
  name: 'Autocomplete',
  emits: ['update:modelValue', 'select', 'focus', 'blur'],
  props: {
    source: {
      type: [Array, Function],
      default: function _default() {
        return [];
      }
    },
    modelValue: {
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
    readonly: {
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
      default: undefined
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
    this.setSearch(this.modelValue);
  },
  watch: {
    modelValue: function modelValue(newValue) {
      this.setSearch(newValue);
    }
  },
  computed: {
    availableItems: function availableItems() {
      var _this = this;

      if (this.dynamic) {
        return this.items;
      }

      if (this.internalSearch !== false && this.search) {
        return this.source.filter(function (item) {
          return new RegExp(_this.search, 'i').test(_this.getLabel(item));
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
      var _this2 = this;

      this.setSearch(item);
      this.$emit('update:modelValue', item);
      this.$nextTick(function () {
        _this2.$emit('select', item);
      });
    },
    onInput: function onInput() {
      this.cursor = -1;
      this.activate();
      this.keepSearch = true;
      this.$emit('update:modelValue', null);
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
      if (this.modelValue && item) {
        if (typeof item === 'string') {
          return this.modelValue === item;
        } else if (this.label) {
          return this.modelValue[this.label] === item[this.label];
        }
      }

      return false;
    },
    updateItems: function updateItems() {
      var _this3 = this;

      if (!this.dynamic) return;
      this.items = [];
      clearTimeout(this.timeout);
      if (!this.canUpdateItems) return;
      var search = this.search;
      this.timeout = setTimeout(function () {
        return _this3.callSource(search);
      }, this.debounce);
    },
    callSource: function callSource(search) {
      var _this4 = this;

      this.isLoading = true;
      Promise.resolve().then(function () {
        return _this4.source(search);
      }).catch(function () {
        return [];
      }).then(function (items) {
        _this4.items = items;
        _this4.isLoading = false;
      });
    },
    updateDirection: function updateDirection() {
      var _this5 = this;

      this.$nextTick(function () {
        var _this5$$el$getBoundin = _this5.$el.getBoundingClientRect(),
            top = _this5$$el$getBoundin.top,
            height = _this5$$el$getBoundin.height;

        _this5.direction = top + height / 2 > window.innerHeight / 2 ? 'top' : 'bottom';
      });
    }
  }
};var _hoisted_1$6 = {
  class: "form-autocomplete"
};
var _hoisted_2$4 = {
  key: 0,
  class: "form-icon loading"
};
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("div", _hoisted_1$6, [vue.createVNode("form", {
    name: "autocomplete",
    onSubmit: _cache[10] || (_cache[10] = vue.withModifiers(function () {
      return $options.onKeyEnter && $options.onKeyEnter.apply($options, arguments);
    }, ["prevent", "stop"])),
    autocomplete: "off"
  }, [vue.createVNode("div", {
    class: $options.inputGroupClasses
  }, [vue.withDirectives(vue.createVNode("input", {
    type: "text",
    class: ["form-input", $props.inputClass],
    autocomplete: "off",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = function ($event) {
      return $data.search = $event;
    }),
    id: $props.inputId,
    disabled: $props.disabled,
    readonly: $props.readonly,
    placeholder: $props.placeholder,
    onInput: _cache[2] || (_cache[2] = function () {
      return $options.onInput && $options.onInput.apply($options, arguments);
    }),
    onFocus: _cache[3] || (_cache[3] = vue.withModifiers(function () {
      return $options.onFocus && $options.onFocus.apply($options, arguments);
    }, ["prevent"])),
    onBlur: _cache[4] || (_cache[4] = vue.withModifiers(function () {
      return $options.onBlur && $options.onBlur.apply($options, arguments);
    }, ["prevent"])),
    onKeyup: _cache[5] || (_cache[5] = vue.withKeys(vue.withModifiers(function () {
      return $options.deactivate && $options.deactivate.apply($options, arguments);
    }, ["prevent"]), ["esc"])),
    onKeydown: [_cache[6] || (_cache[6] = vue.withKeys(function () {
      return $options.onKeyEnter && $options.onKeyEnter.apply($options, arguments);
    }, ["tab"])), _cache[8] || (_cache[8] = vue.withKeys(vue.withModifiers(function () {
      return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
    }, ["prevent"]), ["down"])), _cache[9] || (_cache[9] = vue.withKeys(vue.withModifiers(function () {
      return $options.onKeyUp && $options.onKeyUp.apply($options, arguments);
    }, ["prevent"]), ["up"]))],
    onKeypress: _cache[7] || (_cache[7] = vue.withKeys(vue.withModifiers(function () {
      return $options.onKeyEnter && $options.onKeyEnter.apply($options, arguments);
    }, ["prevent", "stop"]), ["enter"]))
  }, null, 42, ["id", "disabled", "readonly", "placeholder"]), [[vue.vModelText, $data.search]]), $options.canShowLoading ? (vue.openBlock(), vue.createBlock("i", _hoisted_2$4)) : vue.createCommentVNode("", true), vue.renderSlot(_ctx.$slots, "action")], 2)], 32), $options.canShow ? (vue.openBlock(), vue.createBlock("ul", {
    key: 0,
    class: ["menu", this.direction],
    style: $options.menuStyles
  }, [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.availableItems, function (item, i) {
    return vue.openBlock(), vue.createBlock("li", {
      class: ["menu-item", $options.itemClasses(item, i)],
      onClick: function onClick($event) {
        return $options.select(item);
      },
      onMouseover: function onMouseover($event) {
        return $data.cursor = i;
      }
    }, [vue.renderSlot(_ctx.$slots, "default", {
      item: item,
      search: $data.search,
      highlight: $options.highlightItem,
      getLabel: $options.getLabel
    }, function () {
      return [vue.createVNode("a", {
        innerHTML: $options.highlightItem($options.getLabel(item))
      }, null, 8, ["innerHTML"])];
    })], 42, ["onClick", "onMouseover"]);
  }), 256))], 6)) : vue.createCommentVNode("", true)]);
}function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}var css_248z$3 = ".form-autocomplete .menu {\n  overflow-y: auto;\n}\n.form-autocomplete .menu.top {\n  bottom: 100%;\n  top: auto;\n  transform: translateY(-0.2rem);\n}\n.form-autocomplete .loading:not(:last-child) {\n  right: 1.85rem;\n}\n.form-autocomplete .menu-item a {\n  cursor: pointer;\n}\n.form-autocomplete .menu-item-active {\n  background-color: #f1f1fc;\n}\n.form-autocomplete .highlight {\n  font-weight: bold;\n}";
styleInject(css_248z$3);script$9.render = render$9;var state = {};
function get$1(key) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return key in state ? state[key] : defaultValue;
}
function set(key, value) {
  state[key] = value;
}
function getOrSet(key, initialValue) {
  if (!(key in state)) {
    state[key] = initialValue;
  }

  return state[key];
}var configKeyPrefix = '$';
var LOCALE_KEY = "".concat(configKeyPrefix, "locale");
var LOCALE_DEFAULT = 'en';
var PREFIX_KEY = "".concat(configKeyPrefix, "prefix");
var PREFIX_DEFAULT = 'dx';
var availableKeys = [LOCALE_KEY, PREFIX_KEY];
function init(options) {
  for (var option in options) {
    var key = "".concat(configKeyPrefix).concat(option);

    if (availableKeys.includes(key)) {
      set(key, options[option]);
    }
  }
}
function getLocale() {
  return (get$1(LOCALE_KEY) || LOCALE_DEFAULT).toLowerCase();
}
function getPrefix() {
  return (get$1(PREFIX_KEY) || PREFIX_DEFAULT).toLowerCase();
}var base = {
  daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var data = {
  en: base,
  'pt-br': _objectSpread2(_objectSpread2({}, base), {}, {
    daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  })
};
function get() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var locale = getLocale();
  var language = locale in data ? data[locale] : base;

  if (key !== null) {
    return key in language ? language[key] : null;
  }

  return language;
}var script$8 = {
  emits: ['update:modelValue', 'select', 'month-change'],
  props: {
    modelValue: {
      type: Date
    },
    min: {
      type: Date
    },
    max: {
      type: Date
    },
    highlights: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    daysOfWeek: {
      type: Array,
      default: function _default() {
        return get('daysOfWeek');
      }
    },
    months: {
      type: Array,
      default: function _default() {
        return get('months');
      }
    }
  },
  data: function data() {
    return {
      today: this.onlyDate(new Date()),
      month: this.onlyDate(new Date(), true, true),
      days: []
    };
  },
  mounted: function mounted() {
    this.setMonth(this.modelValue || new Date());
    this.mount();
  },
  watch: {
    modelValue: function modelValue(date) {
      this.setMonth(date);
      this.mount();
    },
    highlights: function highlights() {
      this.mount();
    }
  },
  methods: {
    reset: function reset() {
      this.month = this.onlyDate(this.modelValue, true, true);
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
      this.$emit('update:modelValue', data.date);
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
      if (this.modelValue) {
        return this.onlyDate(this.modelValue, true).getTime() === date.getTime();
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
};var _hoisted_1$5 = {
  class: "calendar"
};
var _hoisted_2$3 = {
  class: "calendar-nav navbar"
};

var _hoisted_3$2 = /*#__PURE__*/vue.createVNode("i", {
  class: "icon icon-arrow-left"
}, null, -1);

var _hoisted_4$1 = {
  class: "navbar-primary"
};

var _hoisted_5$1 = /*#__PURE__*/vue.createVNode("i", {
  class: "icon icon-arrow-right"
}, null, -1);

var _hoisted_6 = {
  class: "calendar-container"
};
var _hoisted_7 = {
  class: "calendar-header"
};
var _hoisted_8 = {
  class: "calendar-date"
};
var _hoisted_9 = {
  class: "calendar-body"
};
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("div", _hoisted_1$5, [vue.createVNode("div", _hoisted_2$3, [vue.createVNode("button", {
    class: "btn btn-action btn-link",
    onClick: _cache[1] || (_cache[1] = function () {
      return $options.prev && $options.prev.apply($options, arguments);
    }),
    disabled: !$options.canPrev
  }, [vue.renderSlot(_ctx.$slots, "prev-nav", {}, function () {
    return [_hoisted_3$2];
  })], 8, ["disabled"]), vue.createVNode("div", _hoisted_4$1, vue.toDisplayString($options.headerTitle), 1), vue.createVNode("button", {
    class: "btn btn-action btn-link",
    onClick: _cache[2] || (_cache[2] = function () {
      return $options.next && $options.next.apply($options, arguments);
    }),
    disabled: !$options.canNext
  }, [vue.renderSlot(_ctx.$slots, "next-nav", {}, function () {
    return [_hoisted_5$1];
  })], 8, ["disabled"])]), vue.createVNode("div", _hoisted_6, [vue.createVNode("div", _hoisted_7, [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.daysOfWeek, function (day) {
    return vue.openBlock(), vue.createBlock("div", _hoisted_8, vue.toDisplayString(day), 1);
  }), 256))]), vue.createVNode("div", _hoisted_9, [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($data.days, function (day) {
    return vue.openBlock(), vue.createBlock("div", {
      class: ["calendar-date", $options.dayClasses(day)]
    }, [vue.createVNode("button", {
      class: ["date-item", {
        'date-today': day.isToday,
        active: $options.isActive(day.date)
      }],
      onClick: function onClick($event) {
        return $options.select(day);
      }
    }, vue.toDisplayString(day.day), 11, ["onClick"])], 2);
  }), 256))])])]);
}script$8.render = render$8;var script$7 = {
  name: 'Dropdown',
  emits: ['select'],
  props: {
    items: {
      type: Array,
      default: []
    },
    label: {
      type: String
    },
    direction: {
      type: String,
      enum: ['left', 'right'],
      default: 'left'
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      active: false
    };
  },
  beforeUnmount: function beforeUnmount() {
    this.deactivate();
  },
  methods: {
    toggle: function toggle() {
      this.active ? this.deactivate() : this.activate();
    },
    activate: function activate() {
      var _this = this;

      if (!this.disabled) {
        this.active = true;
        setTimeout(function () {
          return document.addEventListener('click', _this.deactivate);
        }, 1);
      }
    },
    deactivate: function deactivate() {
      this.active = false;
      document.removeEventListener('click', this.deactivate);
    },
    select: function select(item) {
      this.$emit('select', item);
      this.deactivate();
    },
    getLabel: function getLabel(item) {
      return this.label ? item[this.label] : item;
    }
  },
  computed: {
    classes: function classes() {
      return {
        active: this.active,
        'dropdown-right': this.direction === 'right',
        'dropdown-disabled': this.disabled
      };
    },
    menuStyles: function menuStyles() {
      return {
        maxHeight: "".concat(this.maxHeight, "px")
      };
    }
  }
};var _hoisted_1$4 = {
  key: 0,
  class: "divider"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("div", {
    class: ["dropdown", $options.classes]
  }, [vue.createVNode("a", {
    class: "c-hand",
    onClick: _cache[1] || (_cache[1] = function () {
      return $options.toggle && $options.toggle.apply($options, arguments);
    }),
    tabindex: "0"
  }, [vue.renderSlot(_ctx.$slots, "default")]), vue.withDirectives(vue.createVNode("ul", {
    class: "menu",
    style: $options.menuStyles,
    onClick: _cache[3] || (_cache[3] = vue.withModifiers(function () {}, ["stop"]))
  }, [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.items, function (item) {
    return vue.openBlock(), vue.createBlock(vue.Fragment, null, [item === '-' ? (vue.openBlock(), vue.createBlock("li", _hoisted_1$4)) : (vue.openBlock(), vue.createBlock("li", {
      key: 1,
      class: "menu-item",
      onClick: function onClick($event) {
        return $options.select(item);
      }
    }, [vue.renderSlot(_ctx.$slots, "item", {
      item: item
    }, function () {
      return [vue.createVNode("a", {
        href: "#",
        onClick: _cache[2] || (_cache[2] = vue.withModifiers(function () {}, ["prevent"]))
      }, vue.toDisplayString($options.getLabel(item)), 1)];
    })], 8, ["onClick"]))], 64);
  }), 256))], 4), [[vue.vShow, $data.active]])], 2);
}script$7.render = render$7;var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}var stringMask = createCommonjsModule(function (module, exports) {
(function(root, factory) {
    /* istanbul ignore next */
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(commonjsGlobal, function() {
    var tokens = {
        '0': {pattern: /\d/, _default: '0'},
        '9': {pattern: /\d/, optional: true},
        '#': {pattern: /\d/, optional: true, recursive: true},
        'A': {pattern: /[a-zA-Z0-9]/},
        'S': {pattern: /[a-zA-Z]/},
        'U': {pattern: /[a-zA-Z]/, transform: function(c) { return c.toLocaleUpperCase(); }},
        'L': {pattern: /[a-zA-Z]/, transform: function(c) { return c.toLocaleLowerCase(); }},
        '$': {escape: true}
    };

    function isEscaped(pattern, pos) {
        var count = 0;
        var i = pos - 1;
        var token = {escape: true};
        while (i >= 0 && token && token.escape) {
            token = tokens[pattern.charAt(i)];
            count += token && token.escape ? 1 : 0;
            i--;
        }
        return count > 0 && count % 2 === 1;
    }

    function calcOptionalNumbersToUse(pattern, value) {
        var numbersInP = pattern.replace(/[^0]/g,'').length;
        var numbersInV = value.replace(/[^\d]/g,'').length;
        return numbersInV - numbersInP;
    }

    function concatChar(text, character, options, token) {
        if (token && typeof token.transform === 'function') {
            character = token.transform(character);
        }
        if (options.reverse) {
            return character + text;
        }
        return text + character;
    }

    function hasMoreTokens(pattern, pos, inc) {
        var pc = pattern.charAt(pos);
        var token = tokens[pc];
        if (pc === '') {
            return false;
        }
        return token && !token.escape ? true : hasMoreTokens(pattern, pos + inc, inc);
    }

    function hasMoreRecursiveTokens(pattern, pos, inc) {
        var pc = pattern.charAt(pos);
        var token = tokens[pc];
        if (pc === '') {
            return false;
        }
        return token && token.recursive ? true : hasMoreRecursiveTokens(pattern, pos + inc, inc);
    }

    function insertChar(text, char, position) {
        var t = text.split('');
        t.splice(position, 0, char);
        return t.join('');
    }

    function StringMask(pattern, opt) {
        this.options = opt || {};
        this.options = {
            reverse: this.options.reverse || false,
            usedefaults: this.options.usedefaults || this.options.reverse
        };
        this.pattern = pattern;
    }

    StringMask.prototype.process = function proccess(value) {
        if (!value) {
            return {result: '', valid: false};
        }
        value = value + '';
        var pattern2 = this.pattern;
        var valid = true;
        var formatted = '';
        var valuePos = this.options.reverse ? value.length - 1 : 0;
        var patternPos = 0;
        var optionalNumbersToUse = calcOptionalNumbersToUse(pattern2, value);
        var escapeNext = false;
        var recursive = [];
        var inRecursiveMode = false;

        var steps = {
            start: this.options.reverse ? pattern2.length - 1 : 0,
            end: this.options.reverse ? -1 : pattern2.length,
            inc: this.options.reverse ? -1 : 1
        };

        function continueCondition(options) {
            if (!inRecursiveMode && !recursive.length && hasMoreTokens(pattern2, patternPos, steps.inc)) {
                // continue in the normal iteration
                return true;
            } else if (!inRecursiveMode && recursive.length &&
                hasMoreRecursiveTokens(pattern2, patternPos, steps.inc)) {
                // continue looking for the recursive tokens
                // Note: all chars in the patterns after the recursive portion will be handled as static string
                return true;
            } else if (!inRecursiveMode) {
                // start to handle the recursive portion of the pattern
                inRecursiveMode = recursive.length > 0;
            }

            if (inRecursiveMode) {
                var pc = recursive.shift();
                recursive.push(pc);
                if (options.reverse && valuePos >= 0) {
                    patternPos++;
                    pattern2 = insertChar(pattern2, pc, patternPos);
                    return true;
                } else if (!options.reverse && valuePos < value.length) {
                    pattern2 = insertChar(pattern2, pc, patternPos);
                    return true;
                }
            }
            return patternPos < pattern2.length && patternPos >= 0;
        }

        /**
         * Iterate over the pattern's chars parsing/matching the input value chars
         * until the end of the pattern. If the pattern ends with recursive chars
         * the iteration will continue until the end of the input value.
         *
         * Note: The iteration must stop if an invalid char is found.
         */
        for (patternPos = steps.start; continueCondition(this.options); patternPos = patternPos + steps.inc) {
            // Value char
            var vc = value.charAt(valuePos);
            // Pattern char to match with the value char
            var pc = pattern2.charAt(patternPos);

            var token = tokens[pc];
            if (recursive.length && token && !token.recursive) {
                // In the recursive portion of the pattern: tokens not recursive must be seen as static chars
                token = null;
            }

            // 1. Handle escape tokens in pattern
            // go to next iteration: if the pattern char is a escape char or was escaped
            if (!inRecursiveMode || vc) {
                if (this.options.reverse && isEscaped(pattern2, patternPos)) {
                    // pattern char is escaped, just add it and move on
                    formatted = concatChar(formatted, pc, this.options, token);
                    // skip escape token
                    patternPos = patternPos + steps.inc;
                    continue;
                } else if (!this.options.reverse && escapeNext) {
                    // pattern char is escaped, just add it and move on
                    formatted = concatChar(formatted, pc, this.options, token);
                    escapeNext = false;
                    continue;
                } else if (!this.options.reverse && token && token.escape) {
                    // mark to escape the next pattern char
                    escapeNext = true;
                    continue;
                }
            }

            // 2. Handle recursive tokens in pattern
            // go to next iteration: if the value str is finished or
            //                       if there is a normal token in the recursive portion of the pattern
            if (!inRecursiveMode && token && token.recursive) {
                // save it to repeat in the end of the pattern and handle the value char now
                recursive.push(pc);
            } else if (inRecursiveMode && !vc) {
                // in recursive mode but value is finished. Add the pattern char if it is not a recursive token
                formatted = concatChar(formatted, pc, this.options, token);
                continue;
            } else if (!inRecursiveMode && recursive.length > 0 && !vc) {
                // recursiveMode not started but already in the recursive portion of the pattern
                continue;
            }

            // 3. Handle the value
            // break iterations: if value is invalid for the given pattern
            if (!token) {
                // add char of the pattern
                formatted = concatChar(formatted, pc, this.options, token);
                if (!inRecursiveMode && recursive.length) {
                    // save it to repeat in the end of the pattern
                    recursive.push(pc);
                }
            } else if (token.optional) {
                // if token is optional, only add the value char if it matchs the token pattern
                //                       if not, move on to the next pattern char
                if (token.pattern.test(vc) && optionalNumbersToUse) {
                    formatted = concatChar(formatted, vc, this.options, token);
                    valuePos = valuePos + steps.inc;
                    optionalNumbersToUse--;
                } else if (recursive.length > 0 && vc) {
                    valid = false;
                    break;
                }
            } else if (token.pattern.test(vc)) {
                // if token isn't optional the value char must match the token pattern
                formatted = concatChar(formatted, vc, this.options, token);
                valuePos = valuePos + steps.inc;
            } else if (!vc && token._default && this.options.usedefaults) {
                // if the token isn't optional and has a default value, use it if the value is finished
                formatted = concatChar(formatted, token._default, this.options, token);
            } else {
                // the string value don't match the given pattern
                valid = false;
                break;
            }
        }

        return {result: formatted, valid: valid};
    };

    StringMask.prototype.apply = function(value) {
        return this.process(value).result;
    };

    StringMask.prototype.validate = function(value) {
        return this.process(value).valid;
    };

    StringMask.process = function(value, pattern, options) {
        return new StringMask(pattern, options).process(value);
    };

    StringMask.apply = function(value, pattern, options) {
        return new StringMask(pattern, options).apply(value);
    };

    StringMask.validate = function(value, pattern, options) {
        return new StringMask(pattern, options).validate(value);
    };

    return StringMask;
}));
});var script$6 = {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String
    }
  },
  data: function data() {
    return {
      lastValue: null,
      display: ''
    };
  },
  watch: {
    modelValue: function modelValue(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue, true);
      }
    }
  },
  created: function created() {
    this.display = this.mask(this.modelValue, true);
  },
  methods: {
    onInput: function onInput(e) {
      var currentValue = e.target.value; // Get current cursor position

      var position = this.$refs.input.selectionEnd;
      this.refresh(e.target.value);
      var newValue = this.display;

      if (this.$refs.input === document.activeElement) {
        // Find next cursor position
        if (position === currentValue.length) {
          position = newValue.length;
        } else if (position > 0 && position <= newValue.length) {
          if (currentValue.charAt(position - 1) === newValue.charAt(position)) {
            position += 1;
          }
        } // Restore cursor position


        this.$refs.input.setSelectionRange(position, position);
      }
    },
    refresh: function refresh(value) {
      var maskedValue = this.mask(value);
      var outValue = this.formatOutput(maskedValue);
      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (outValue !== this.lastValue) {
        this.lastValue = outValue;
        this.$emit('update:modelValue', outValue);
      }
    },
    mask: function mask(value) {
      var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (!value) return '';

      if (parse) {
        if (typeof value === 'string') {
          if (/\d{4}-\d{2}-\d{2}/.test(value)) {
            return value.substr(0, 10).split('-').reverse().join('/');
          }
        }
      }

      var maskValue = value.replace(/\D/g, '');
      return stringMask.apply(maskValue, this.pattern).replace(/[^0-9]$/, '');
    },
    formatOutput: function formatOutput(value) {
      return value.split('/').reverse().join('-');
    }
  },
  computed: {
    pattern: function pattern() {
      return '00/00/0000';
    },
    inputAttrs: function inputAttrs() {
      return _objectSpread2(_objectSpread2({}, this.$attrs), {}, {
        onInput: this.onInput
      });
    }
  }
};function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("input", vue.mergeProps({
    type: "text",
    class: "form-input"
  }, $options.inputAttrs, {
    value: $data.display,
    placeholder: $options.pattern,
    ref: "input"
  }), null, 16, ["value", "placeholder"]);
}script$6.render = render$6;var script$5 = {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [Number, String]
    },
    precision: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      lastValue: null,
      display: ''
    };
  },
  watch: {
    modelValue: function modelValue(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue);
      }
    }
  },
  created: function created() {
    this.display = this.mask(this.modelValue);
  },
  methods: {
    onInput: function onInput(e) {
      this.refresh(e.target.value);
    },
    refresh: function refresh(value) {
      var maskedValue = this.mask(value);
      var numberValue = this.toNumber(maskedValue);
      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (numberValue !== this.lastValue) {
        this.lastValue = numberValue;
        this.$emit('update:modelValue', numberValue);
      }
    },
    mask: function mask(value) {
      if (!value) {
        return '';
      }

      if (typeof value === 'number') {
        value = this.precision > 0 ? value.toFixed(this.precision) : Math.trunc(value).toString();
      }

      var maskValue = Number(value.replace(/\D/g, '')).toString();
      return stringMask.apply(maskValue, this.pattern, {
        reverse: true
      });
    },
    toNumber: function toNumber(value) {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    }
  },
  computed: {
    pattern: function pattern() {
      return "#.##".concat(this.placeholder);
    },
    placeholder: function placeholder() {
      return this.precision > 0 ? "0,".concat('0'.repeat(this.precision)) : '0';
    },
    inputAttrs: function inputAttrs() {
      return _objectSpread2(_objectSpread2({}, this.$attrs), {}, {
        onInput: this.onInput
      });
    }
  }
};function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("input", vue.mergeProps({
    type: "text",
    class: "form-input text-right"
  }, $options.inputAttrs, {
    value: $data.display,
    placeholder: $options.placeholder,
    ref: "input"
  }), null, 16, ["value", "placeholder"]);
}script$5.render = render$5;function randomHash() {
  return Math.random().toString(32).slice(-8);
}
function mount(component) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var props = args.props,
      children = args.children,
      element = args.element,
      app = args.app;
  var el = element;
  var vNode = vue.createVNode(component, props, children);

  if (app && app._context) {
    vNode.appContext = app._context;
  }

  if (!el && typeof document !== 'undefined') {
    el = document.createElement('div');
  }

  if (el) {
    vue.render(vNode, el);
  }

  var destroy = function destroy() {
    if (el) {
      vue.render(null, el);
    }

    el = null;
    vNode = null;
  };

  return {
    vNode: vNode,
    destroy: destroy,
    el: el
  };
}var script$4 = {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    closable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: null
    },
    clickToClose: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      hash: randomHash(),
      activeModals: getOrSet('activeModals', [])
    };
  },
  mounted: function mounted() {
    if (this.modelValue) {
      this.activate();
    }
  },
  watch: {
    modelValue: function modelValue(value) {
      value ? this.activate() : this.deactivate();
    }
  },
  computed: {
    hasHeader: function hasHeader() {
      return this.closable || this.title || 'header' in this.$slots;
    },
    hasFooter: function hasFooter() {
      return 'footer' in this.$slots;
    },
    classes: function classes() {
      var classes = [];

      if (this.size !== null) {
        classes.push("modal-".concat(this.size));
      }

      return classes;
    }
  },
  methods: {
    activate: function activate() {
      this.activeModals.push(this.hash);

      if (this.closable) {
        document.addEventListener('keydown', this.closeListener);
      }
    },
    deactivate: function deactivate() {
      var _this = this;

      this.activeModals.forEach(function (hash, i) {
        if (hash === _this.hash) {
          _this.activeModals.splice(i, 1);
        }
      });

      if (this.closable) {
        document.removeEventListener('keydown', this.closeListener);
      }
    },
    closeListener: function closeListener(e) {
      if (this.modelValue && e.keyCode === 27 && this.activeModals[this.activeModals.length - 1] === this.hash) {
        this.close();
      }
    },
    overlayClick: function overlayClick() {
      if (this.clickToClose) {
        this.close();
      }
    },
    close: function close() {
      if (this.closable) {
        this.$emit('update:modelValue', false);
      }
    }
  }
};var _hoisted_1$3 = {
  class: "modal-container"
};
var _hoisted_2$2 = {
  key: 0,
  class: "modal-header"
};
var _hoisted_3$1 = {
  key: 0,
  class: "modal-title"
};
var _hoisted_4 = {
  class: "modal-body"
};
var _hoisted_5 = {
  key: 1,
  class: "modal-footer"
};
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock(vue.Teleport, {
    to: "body"
  }, [vue.createVNode(vue.Transition, {
    name: "modal"
  }, {
    default: vue.withCtx(function () {
      return [$props.modelValue ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
        key: 0,
        class: ["modal active", $options.classes]
      }, _ctx.$attrs), [vue.createVNode("div", {
        class: "modal-overlay",
        onClick: _cache[1] || (_cache[1] = function () {
          return $options.overlayClick && $options.overlayClick.apply($options, arguments);
        })
      }), vue.createVNode("div", _hoisted_1$3, [$options.hasHeader ? (vue.openBlock(), vue.createBlock("div", _hoisted_2$2, [$props.closable ? (vue.openBlock(), vue.createBlock("button", {
        key: 0,
        class: "btn btn-clear float-right",
        onClick: _cache[2] || (_cache[2] = function () {
          return $options.close && $options.close.apply($options, arguments);
        })
      })) : vue.createCommentVNode("", true), vue.renderSlot(_ctx.$slots, "header", {}, function () {
        return [$props.title ? (vue.openBlock(), vue.createBlock("div", _hoisted_3$1, vue.toDisplayString($props.title), 1)) : vue.createCommentVNode("", true)];
      })])) : vue.createCommentVNode("", true), vue.createVNode("div", _hoisted_4, [vue.renderSlot(_ctx.$slots, "default")]), $options.hasFooter ? (vue.openBlock(), vue.createBlock("div", _hoisted_5, [vue.renderSlot(_ctx.$slots, "footer")])) : vue.createCommentVNode("", true)])], 16)) : vue.createCommentVNode("", true)];
    }),
    _: 3
  })]);
}var css_248z$2 = ".modal.active.modal-enter-active {\n  transition: all 0.15s;\n}\n.modal.active.modal-leave-active {\n  transition: all 0.3s;\n}\n.modal.active.modal-enter, .modal.active.modal-leave-to {\n  opacity: 0;\n}";
styleInject(css_248z$2);script$4.render = render$4;var script$3 = {
  emits: ['paginate'],
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
};var _hoisted_1$2 = {
  key: 0,
  class: "pagination"
};
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return $options.totalPages > 1 ? (vue.openBlock(), vue.createBlock("ul", _hoisted_1$2, [vue.createVNode("li", {
    class: ["page-item", {
      disabled: $data.currentPage <= 1
    }]
  }, [vue.createVNode("a", {
    href: "#",
    onClick: _cache[1] || (_cache[1] = vue.withModifiers(function ($event) {
      return $options.paginate($data.currentPage - 1);
    }, ["prevent"]))
  }, "Voltar")], 2), (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.pageNumbers, function (page) {
    return vue.openBlock(), vue.createBlock("li", {
      class: ["page-item", {
        active: $data.currentPage === page
      }]
    }, [vue.createVNode("a", {
      href: "#",
      onClick: vue.withModifiers(function ($event) {
        return $options.paginate(page);
      }, ["prevent"])
    }, vue.toDisplayString(page), 9, ["onClick"])], 2);
  }), 256)), vue.createVNode("li", {
    class: ["page-item", {
      disabled: $data.currentPage === $options.totalPages
    }]
  }, [vue.createVNode("a", {
    href: "#",
    onClick: _cache[2] || (_cache[2] = vue.withModifiers(function ($event) {
      return $options.paginate($data.currentPage + 1);
    }, ["prevent"]))
  }, "Avançar")], 2)])) : vue.createCommentVNode("", true);
}script$3.render = render$3;var script$2 = {
  emits: ['change'],
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      tabs: [],
      activeTabId: undefined
    };
  },
  mounted: function mounted() {
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].id);
    }
  },
  methods: {
    findTab: function findTab(id) {
      return this.tabs.find(function (tab) {
        return tab.id === id;
      });
    },
    selectTab: function selectTab(selectedTabId) {
      var selectedTab = this.findTab(selectedTabId);

      if (!selectedTab || selectedTab.disabled) {
        return;
      }

      this.tabs.forEach(function (tab) {
        tab.isActive = tab.id === selectedTab.id;
      });

      if (this.activeTabId !== undefined) {
        this.$emit('change', {
          id: this.activeTabId
        });
      }

      this.activeTabId = selectedTab.id;
    },
    activeTab: function activeTab() {
      return this.activeTabId;
    }
  }
};var _hoisted_1$1 = {
  class: "tabs-container"
};
var _hoisted_2$1 = {
  key: 0,
  class: "tab-item tab-action"
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock("div", _hoisted_1$1, [vue.createVNode("ul", {
    class: ["tab", {
      'tab-block': this.block
    }]
  }, [(vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($data.tabs, function (tab) {
    return vue.openBlock(), vue.createBlock("li", {
      class: ["tab-item", {
        active: tab.isActive
      }]
    }, [vue.createVNode("a", {
      href: "#",
      onClick: vue.withModifiers(function ($event) {
        return $options.selectTab(tab.id);
      }, ["prevent"]),
      class: {
        'disabled': tab.disabled
      }
    }, vue.toDisplayString(tab.label), 11, ["onClick"])], 2);
  }), 256)), 'action' in _ctx.$slots ? (vue.openBlock(), vue.createBlock("li", _hoisted_2$1, [vue.renderSlot(_ctx.$slots, "action")])) : vue.createCommentVNode("", true)], 2), vue.renderSlot(_ctx.$slots, "default")]);
}var css_248z$1 = ".tab .tab-item a.disabled {\n  cursor: default;\n  opacity: 0.5;\n  pointer-events: none;\n}\n.tab .tab-item a:focus {\n  box-shadow: none;\n}";
styleInject(css_248z$1);script$2.render = render$2;var script$1 = {
  props: {
    id: {
      type: String,
      default: randomHash
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      isActive: false
    };
  },
  created: function created() {
    this.$parent.tabs.push(this);
  }
};function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.disabled ? vue.withDirectives((vue.openBlock(), vue.createBlock("section", {
    key: 0,
    class: "tab-panel",
    "aria-hidden": !$data.isActive,
    id: "tab-".concat($props.id),
    role: "tabpanel"
  }, [vue.renderSlot(_ctx.$slots, "default")], 8, ["aria-hidden", "id"])), [[vue.vShow, $data.isActive]]) : vue.createCommentVNode("", true);
}script$1.render = render$1;var script = {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Object],
      default: ''
    }
  },
  data: function data() {
    return {
      visible: this.show
    };
  },
  watch: {
    show: function show() {
      this.visible = this.show;
    }
  },
  computed: {
    parsedContent: function parsedContent() {
      var content = typeof this.content === 'string' ? {
        message: this.content
      } : this.content;
      return _objectSpread2({
        title: '',
        message: ''
      }, content);
    },
    title: function title() {
      return this.parsedContent.title;
    },
    message: function message() {
      return this.parsedContent.message;
    }
  }
};var _hoisted_1 = {
  key: 0,
  class: "toast-wrapper"
};
var _hoisted_2 = {
  key: 0,
  class: "toast-title"
};
var _hoisted_3 = {
  class: "toast-message"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock(vue.Teleport, {
    to: "body"
  }, [$data.visible ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [vue.createVNode("div", {
    class: ["toast", $props.type ? "toast-".concat($props.type) : '']
  }, [vue.createVNode("button", {
    class: "btn btn-clear float-right",
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return $data.visible = false;
    })
  }), $options.title ? (vue.openBlock(), vue.createBlock("h6", _hoisted_2, vue.toDisplayString($options.title), 1)) : vue.createCommentVNode("", true), vue.createVNode("p", _hoisted_3, vue.toDisplayString($options.message), 1)], 2)])) : vue.createCommentVNode("", true)]);
}var css_248z = ".toast-wrapper {\n  left: 50%;\n  min-width: 10rem;\n  position: absolute;\n  top: 0.5rem;\n  transform: translateX(-50%);\n  z-index: 410;\n}";
styleInject(css_248z);script.render = render;var components$1=/*#__PURE__*/Object.freeze({__proto__:null,Autocomplete: script$9,Calendar: script$8,Dropdown: script$7,InputNumber: script$5,InputDate: script$6,Modal: script$4,Pagination: script$3,Tabs: script$2,Tab: script$1,Toast: script});var appInstance;
var toast;
var timeout;

function close() {
  if (!!toast) {
    toast.destroy();
  }

  clearTimeout(timeout);
}

function show(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = _objectSpread2({
    type: null,
    timeout: 5
  }, options);
  close();
  toast = mount(script, {
    props: {
      show: true,
      content: content,
      type: options.type
    },
    app: appInstance
  });

  if (options.timeout) {
    clearTimeout(timeout);
    timeout = setTimeout(close, options.timeout * 1000);
  }
}

function primary(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return show(content, _objectSpread2(_objectSpread2({}, options), {}, {
    type: 'primary'
  }));
}

function success(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return show(content, _objectSpread2(_objectSpread2({}, options), {}, {
    type: 'success'
  }));
}

function warning(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return show(content, _objectSpread2(_objectSpread2({}, options), {}, {
    type: 'warning'
  }));
}

function error(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return show(content, _objectSpread2(_objectSpread2({}, options), {}, {
    type: 'error'
  }));
}

function info(content) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return show(content, _objectSpread2(_objectSpread2({}, options), {}, {
    type: 'info'
  }));
}

function setup(app) {
  appInstance = app;
  app.config.globalProperties.$toast = {
    show: show,
    primary: primary,
    success: success,
    warning: warning,
    error: error,
    info: info,
    close: close
  };
}var plugins=/*#__PURE__*/Object.freeze({__proto__:null,toast: setup});// Import vue components

var install = function installPlugin(app) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  init(options); // Register components

  var prefix = getPrefix();

  for (var component in components$1) {
    var tagName = "".concat(prefix).concat(component).replace(/[A-Z]/g, function (c) {
      return "-".concat(c.toLowerCase());
    });
    app.component(tagName, components$1[component]);
  } // Register plugins


  for (var plugin in plugins) {
    plugins[plugin](app);
  }
}; // Create module definition for Vue.use()
var components=/*#__PURE__*/Object.freeze({__proto__:null,'default': install,Autocomplete: script$9,Calendar: script$8,Dropdown: script$7,InputNumber: script$5,InputDate: script$6,Modal: script$4,Pagination: script$3,Tabs: script$2,Tab: script$1,Toast: script});// only expose one global var, with component exports exposed as properties of
// that global var (eg. plugin.component)

Object.entries(components).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      componentName = _ref2[0],
      component = _ref2[1];

  if (componentName !== 'default') {
    install[componentName] = component;
  }
});module.exports=install;