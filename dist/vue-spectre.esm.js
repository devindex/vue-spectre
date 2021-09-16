import { openBlock, createBlock, createVNode, withModifiers, withDirectives, withKeys, vModelText, createCommentVNode, renderSlot, Fragment, renderList, toDisplayString, vShow, mergeProps, render as render$a, Teleport, Transition, withCtx } from 'vue';

var script$9 = {
  name: 'Autocomplete',
  emits: ['update:modelValue', 'select', 'focus', 'blur'],
  props: {
    source: {
      type: [Array, Function],
      default: () => []
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
    this.setSearch(this.modelValue);
  },

  watch: {
    modelValue(newValue) {
      this.setSearch(newValue);
    }

  },
  computed: {
    availableItems() {
      if (this.dynamic) {
        return this.items;
      }

      if (this.internalSearch !== false && this.search) {
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
      this.$emit('update:modelValue', item);
      this.$nextTick(() => {
        this.$emit('select', item);
      });
    },

    onInput() {
      this.cursor = -1;
      this.activate();
      this.keepSearch = true;
      this.$emit('update:modelValue', null);
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
      if (this.modelValue && item) {
        if (typeof item === 'string') {
          return this.modelValue === item;
        } else if (this.label) {
          return this.modelValue[this.label] === item[this.label];
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

  }
};

const _hoisted_1$6 = {
  class: "form-autocomplete"
};
const _hoisted_2$4 = {
  key: 0,
  class: "form-icon loading"
};
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1$6, [createVNode("form", {
    name: "autocomplete",
    onSubmit: _cache[10] || (_cache[10] = withModifiers((...args) => $options.onKeyEnter && $options.onKeyEnter(...args), ["prevent", "stop"])),
    autocomplete: "off"
  }, [createVNode("div", {
    class: $options.inputGroupClasses
  }, [withDirectives(createVNode("input", {
    type: "text",
    class: ["form-input", $props.inputClass],
    autocomplete: "off",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $data.search = $event),
    id: $props.inputId,
    disabled: $props.disabled,
    readonly: $props.readonly,
    placeholder: $props.placeholder,
    onInput: _cache[2] || (_cache[2] = (...args) => $options.onInput && $options.onInput(...args)),
    onFocus: _cache[3] || (_cache[3] = withModifiers((...args) => $options.onFocus && $options.onFocus(...args), ["prevent"])),
    onBlur: _cache[4] || (_cache[4] = withModifiers((...args) => $options.onBlur && $options.onBlur(...args), ["prevent"])),
    onKeyup: _cache[5] || (_cache[5] = withKeys(withModifiers((...args) => $options.deactivate && $options.deactivate(...args), ["prevent"]), ["esc"])),
    onKeydown: [_cache[6] || (_cache[6] = withKeys((...args) => $options.onKeyEnter && $options.onKeyEnter(...args), ["tab"])), _cache[8] || (_cache[8] = withKeys(withModifiers((...args) => $options.onKeyDown && $options.onKeyDown(...args), ["prevent"]), ["down"])), _cache[9] || (_cache[9] = withKeys(withModifiers((...args) => $options.onKeyUp && $options.onKeyUp(...args), ["prevent"]), ["up"]))],
    onKeypress: _cache[7] || (_cache[7] = withKeys(withModifiers((...args) => $options.onKeyEnter && $options.onKeyEnter(...args), ["prevent", "stop"]), ["enter"]))
  }, null, 42, ["id", "disabled", "readonly", "placeholder"]), [[vModelText, $data.search]]), $options.canShowLoading ? (openBlock(), createBlock("i", _hoisted_2$4)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "action")], 2)], 32), $options.canShow ? (openBlock(), createBlock("ul", {
    key: 0,
    class: ["menu", this.direction],
    style: $options.menuStyles
  }, [(openBlock(true), createBlock(Fragment, null, renderList($options.availableItems, (item, i) => {
    return openBlock(), createBlock("li", {
      class: ["menu-item", $options.itemClasses(item, i)],
      onClick: $event => $options.select(item),
      onMouseover: $event => $data.cursor = i
    }, [renderSlot(_ctx.$slots, "default", {
      item: item,
      search: $data.search,
      highlight: $options.highlightItem,
      getLabel: $options.getLabel
    }, () => [createVNode("a", {
      innerHTML: $options.highlightItem($options.getLabel(item))
    }, null, 8, ["innerHTML"])])], 42, ["onClick", "onMouseover"]);
  }), 256))], 6)) : createCommentVNode("", true)]);
}

function styleInject(css, ref) {
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
}

var css_248z$3 = ".form-autocomplete .menu {\n  overflow-y: auto;\n}\n.form-autocomplete .menu.top {\n  bottom: 100%;\n  top: auto;\n  transform: translateY(-0.2rem);\n}\n.form-autocomplete .loading:not(:last-child) {\n  right: 1.85rem;\n}\n.form-autocomplete .menu-item a {\n  cursor: pointer;\n}\n.form-autocomplete .menu-item-active {\n  background-color: #f1f1fc;\n}\n.form-autocomplete .highlight {\n  font-weight: bold;\n}";
styleInject(css_248z$3);

script$9.render = render$9;

const state = {};
function get$1(key, defaultValue = null) {
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
}

const configKeyPrefix = '$';
const LOCALE_KEY = `${configKeyPrefix}locale`;
const LOCALE_DEFAULT = 'en';
const PREFIX_KEY = `${configKeyPrefix}prefix`;
const PREFIX_DEFAULT = 'dx';
const availableKeys = [LOCALE_KEY, PREFIX_KEY];
function init(options) {
  for (const option in options) {
    const key = `${configKeyPrefix}${option}`;

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
}

const base = {
  daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
const data = {
  en: base,
  'pt-br': { ...base,
    daysOfWeek: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  }
};
function get(key = null) {
  const locale = getLocale();
  const language = locale in data ? data[locale] : base;

  if (key !== null) {
    return key in language ? language[key] : null;
  }

  return language;
}

var script$8 = {
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
      default: () => []
    },
    daysOfWeek: {
      type: Array,
      default: () => get('daysOfWeek')
    },
    months: {
      type: Array,
      default: () => get('months')
    }
  },

  data() {
    return {
      today: this.onlyDate(new Date()),
      month: this.onlyDate(new Date(), true, true),
      days: []
    };
  },

  mounted() {
    this.setMonth(this.modelValue || new Date());
    this.mount();
  },

  watch: {
    modelValue(date) {
      this.setMonth(date);
      this.mount();
    },

    highlights() {
      this.mount();
    }

  },
  methods: {
    reset() {
      this.month = this.onlyDate(this.modelValue, true, true);
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
      this.$emit('update:modelValue', data.date);
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
      if (this.modelValue) {
        return this.onlyDate(this.modelValue, true).getTime() === date.getTime();
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

const _hoisted_1$5 = {
  class: "calendar"
};
const _hoisted_2$3 = {
  class: "calendar-nav navbar"
};

const _hoisted_3$2 = /*#__PURE__*/createVNode("i", {
  class: "icon icon-arrow-left"
}, null, -1);

const _hoisted_4$1 = {
  class: "navbar-primary"
};

const _hoisted_5$1 = /*#__PURE__*/createVNode("i", {
  class: "icon icon-arrow-right"
}, null, -1);

const _hoisted_6 = {
  class: "calendar-container"
};
const _hoisted_7 = {
  class: "calendar-header"
};
const _hoisted_8 = {
  class: "calendar-date"
};
const _hoisted_9 = {
  class: "calendar-body"
};
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1$5, [createVNode("div", _hoisted_2$3, [createVNode("button", {
    class: "btn btn-action btn-link",
    onClick: _cache[1] || (_cache[1] = (...args) => $options.prev && $options.prev(...args)),
    disabled: !$options.canPrev
  }, [renderSlot(_ctx.$slots, "prev-nav", {}, () => [_hoisted_3$2])], 8, ["disabled"]), createVNode("div", _hoisted_4$1, toDisplayString($options.headerTitle), 1), createVNode("button", {
    class: "btn btn-action btn-link",
    onClick: _cache[2] || (_cache[2] = (...args) => $options.next && $options.next(...args)),
    disabled: !$options.canNext
  }, [renderSlot(_ctx.$slots, "next-nav", {}, () => [_hoisted_5$1])], 8, ["disabled"])]), createVNode("div", _hoisted_6, [createVNode("div", _hoisted_7, [(openBlock(true), createBlock(Fragment, null, renderList($props.daysOfWeek, day => {
    return openBlock(), createBlock("div", _hoisted_8, toDisplayString(day), 1);
  }), 256))]), createVNode("div", _hoisted_9, [(openBlock(true), createBlock(Fragment, null, renderList($data.days, day => {
    return openBlock(), createBlock("div", {
      class: ["calendar-date", $options.dayClasses(day)]
    }, [createVNode("button", {
      class: ["date-item", {
        'date-today': day.isToday,
        active: $options.isActive(day.date)
      }],
      onClick: $event => $options.select(day)
    }, toDisplayString(day.day), 11, ["onClick"])], 2);
  }), 256))])])]);
}

script$8.render = render$8;

var script$7 = {
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

  data() {
    return {
      active: false
    };
  },

  beforeUnmount() {
    this.deactivate();
  },

  methods: {
    toggle() {
      this.active ? this.deactivate() : this.activate();
    },

    activate() {
      if (!this.disabled) {
        this.active = true;
        setTimeout(() => document.addEventListener('click', this.deactivate), 1);
      }
    },

    deactivate() {
      this.active = false;
      document.removeEventListener('click', this.deactivate);
    },

    select(item) {
      this.$emit('select', item);
      this.deactivate();
    },

    getLabel(item) {
      return this.label ? item[this.label] : item;
    }

  },
  computed: {
    classes() {
      return {
        active: this.active,
        'dropdown-right': this.direction === 'right',
        'dropdown-disabled': this.disabled
      };
    },

    menuStyles() {
      return {
        maxHeight: `${this.maxHeight}px`
      };
    }

  }
};

const _hoisted_1$4 = {
  key: 0,
  class: "divider"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", {
    class: ["dropdown", $options.classes]
  }, [createVNode("a", {
    class: "c-hand",
    onClick: _cache[1] || (_cache[1] = (...args) => $options.toggle && $options.toggle(...args)),
    tabindex: "0"
  }, [renderSlot(_ctx.$slots, "default")]), withDirectives(createVNode("ul", {
    class: "menu",
    style: $options.menuStyles,
    onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
  }, [(openBlock(true), createBlock(Fragment, null, renderList($props.items, item => {
    return openBlock(), createBlock(Fragment, null, [item === '-' ? (openBlock(), createBlock("li", _hoisted_1$4)) : (openBlock(), createBlock("li", {
      key: 1,
      class: "menu-item",
      onClick: $event => $options.select(item)
    }, [renderSlot(_ctx.$slots, "item", {
      item: item
    }, () => [createVNode("a", {
      href: "#",
      onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["prevent"]))
    }, toDisplayString($options.getLabel(item)), 1)])], 8, ["onClick"]))], 64);
  }), 256))], 4), [[vShow, $data.active]])], 2);
}

script$7.render = render$7;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var stringMask = createCommonjsModule(function (module, exports) {
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
});

var script$6 = {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String
    }
  },

  data() {
    return {
      lastValue: null,
      display: ''
    };
  },

  watch: {
    modelValue(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue, true);
      }
    }

  },

  created() {
    this.display = this.mask(this.modelValue, true);
  },

  methods: {
    onInput(e) {
      const currentValue = e.target.value; // Get current cursor position

      let position = this.$refs.input.selectionEnd;
      this.refresh(e.target.value);
      const newValue = this.display;

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

    refresh(value) {
      const maskedValue = this.mask(value);
      const outValue = this.formatOutput(maskedValue);
      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (outValue !== this.lastValue) {
        this.lastValue = outValue;
        this.$emit('update:modelValue', outValue);
      }
    },

    mask(value, parse = false) {
      if (!value) return '';

      if (parse) {
        if (typeof value === 'string') {
          if (/\d{4}-\d{2}-\d{2}/.test(value)) {
            return value.substr(0, 10).split('-').reverse().join('/');
          }
        }
      }

      const maskValue = value.replace(/\D/g, '');
      return stringMask.apply(maskValue, this.pattern).replace(/[^0-9]$/, '');
    },

    formatOutput(value) {
      return value.split('/').reverse().join('-');
    }

  },
  computed: {
    pattern() {
      return '00/00/0000';
    },

    inputAttrs() {
      return { ...this.$attrs,
        onInput: this.onInput
      };
    }

  }
};

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("input", mergeProps({
    type: "text",
    class: "form-input"
  }, $options.inputAttrs, {
    value: $data.display,
    placeholder: $options.pattern,
    ref: "input"
  }), null, 16, ["value", "placeholder"]);
}

script$6.render = render$6;

var script$5 = {
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

  data() {
    return {
      lastValue: null,
      display: ''
    };
  },

  watch: {
    modelValue(newValue) {
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.display = this.mask(newValue);
      }
    }

  },

  created() {
    this.display = this.mask(this.modelValue);
  },

  methods: {
    onInput(e) {
      this.refresh(e.target.value);
    },

    refresh(value) {
      const maskedValue = this.mask(value);
      const numberValue = this.toNumber(maskedValue);
      this.display = maskedValue;
      this.$refs.input.value = maskedValue;

      if (numberValue !== this.lastValue) {
        this.lastValue = numberValue;
        this.$emit('update:modelValue', numberValue);
      }
    },

    mask(value) {
      if (!value) {
        return '';
      }

      if (typeof value === 'number') {
        value = this.precision > 0 ? value.toFixed(this.precision) : Math.trunc(value).toString();
      }

      const maskValue = Number(value.replace(/\D/g, '')).toString();
      return stringMask.apply(maskValue, this.pattern, {
        reverse: true
      });
    },

    toNumber(value) {
      return Number(value.replace(/\./g, '').replace(',', '.'));
    }

  },
  computed: {
    pattern() {
      return `#.##${this.placeholder}`;
    },

    placeholder() {
      return this.precision > 0 ? `0,${'0'.repeat(this.precision)}` : '0';
    },

    inputAttrs() {
      return { ...this.$attrs,
        onInput: this.onInput
      };
    }

  }
};

function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("input", mergeProps({
    type: "text",
    class: "form-input text-right"
  }, $options.inputAttrs, {
    value: $data.display,
    placeholder: $options.placeholder,
    ref: "input"
  }), null, 16, ["value", "placeholder"]);
}

script$5.render = render$5;

function randomHash() {
  return Math.random().toString(32).slice(-8);
}
function mount(component, args = {}) {
  const {
    props,
    children,
    element,
    app
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
    render$a(vNode, el);
  }

  const destroy = () => {
    if (el) {
      render$a(null, el);
    }

    el = null;
    vNode = null;
  };

  return {
    vNode,
    destroy,
    el
  };
}

var script$4 = {
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

  data() {
    return {
      hash: randomHash(),
      activeModals: getOrSet('activeModals', [])
    };
  },

  mounted() {
    if (this.modelValue) {
      this.activate();
    }
  },

  watch: {
    modelValue(value) {
      value ? this.activate() : this.deactivate();
    }

  },
  computed: {
    hasHeader() {
      return this.closable || this.title || 'header' in this.$slots;
    },

    hasFooter() {
      return 'footer' in this.$slots;
    },

    classes() {
      const classes = [];

      if (this.size !== null) {
        classes.push(`modal-${this.size}`);
      }

      return classes;
    }

  },
  methods: {
    activate() {
      this.activeModals.push(this.hash);

      if (this.closable) {
        document.addEventListener('keydown', this.closeListener);
      }
    },

    deactivate() {
      this.activeModals.forEach((hash, i) => {
        if (hash === this.hash) {
          this.activeModals.splice(i, 1);
        }
      });

      if (this.closable) {
        document.removeEventListener('keydown', this.closeListener);
      }
    },

    closeListener(e) {
      if (this.modelValue && e.keyCode === 27 && this.activeModals[this.activeModals.length - 1] === this.hash) {
        this.close();
      }
    },

    overlayClick() {
      if (this.clickToClose) {
        this.close();
      }
    },

    close() {
      if (this.closable) {
        this.$emit('update:modelValue', false);
      }
    }

  }
};

const _hoisted_1$3 = {
  class: "modal-container"
};
const _hoisted_2$2 = {
  key: 0,
  class: "modal-header"
};
const _hoisted_3$1 = {
  key: 0,
  class: "modal-title"
};
const _hoisted_4 = {
  class: "modal-body"
};
const _hoisted_5 = {
  key: 1,
  class: "modal-footer"
};
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Teleport, {
    to: "body"
  }, [createVNode(Transition, {
    name: "modal"
  }, {
    default: withCtx(() => [$props.modelValue ? (openBlock(), createBlock("div", mergeProps({
      key: 0,
      class: ["modal active", $options.classes]
    }, _ctx.$attrs), [createVNode("div", {
      class: "modal-overlay",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.overlayClick && $options.overlayClick(...args))
    }), createVNode("div", _hoisted_1$3, [$options.hasHeader ? (openBlock(), createBlock("div", _hoisted_2$2, [$props.closable ? (openBlock(), createBlock("button", {
      key: 0,
      class: "btn btn-clear float-right",
      onClick: _cache[2] || (_cache[2] = (...args) => $options.close && $options.close(...args))
    })) : createCommentVNode("", true), renderSlot(_ctx.$slots, "header", {}, () => [$props.title ? (openBlock(), createBlock("div", _hoisted_3$1, toDisplayString($props.title), 1)) : createCommentVNode("", true)])])) : createCommentVNode("", true), createVNode("div", _hoisted_4, [renderSlot(_ctx.$slots, "default")]), $options.hasFooter ? (openBlock(), createBlock("div", _hoisted_5, [renderSlot(_ctx.$slots, "footer")])) : createCommentVNode("", true)])], 16)) : createCommentVNode("", true)]),
    _: 3
  })]);
}

var css_248z$2 = ".modal.active.modal-enter-active {\n  transition: all 0.15s;\n}\n.modal.active.modal-leave-active {\n  transition: all 0.3s;\n}\n.modal.active.modal-enter, .modal.active.modal-leave-to {\n  opacity: 0;\n}";
styleInject(css_248z$2);

script$4.render = render$4;

var script$3 = {
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

const _hoisted_1$2 = {
  key: 0,
  class: "pagination"
};
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return $options.totalPages > 1 ? (openBlock(), createBlock("ul", _hoisted_1$2, [createVNode("li", {
    class: ["page-item", {
      disabled: $data.currentPage <= 1
    }]
  }, [createVNode("a", {
    href: "#",
    onClick: _cache[1] || (_cache[1] = withModifiers($event => $options.paginate($data.currentPage - 1), ["prevent"]))
  }, "Voltar")], 2), (openBlock(true), createBlock(Fragment, null, renderList($options.pageNumbers, page => {
    return openBlock(), createBlock("li", {
      class: ["page-item", {
        active: $data.currentPage === page
      }]
    }, [createVNode("a", {
      href: "#",
      onClick: withModifiers($event => $options.paginate(page), ["prevent"])
    }, toDisplayString(page), 9, ["onClick"])], 2);
  }), 256)), createVNode("li", {
    class: ["page-item", {
      disabled: $data.currentPage === $options.totalPages
    }]
  }, [createVNode("a", {
    href: "#",
    onClick: _cache[2] || (_cache[2] = withModifiers($event => $options.paginate($data.currentPage + 1), ["prevent"]))
  }, "Avançar")], 2)])) : createCommentVNode("", true);
}

script$3.render = render$3;

var script$2 = {
  emits: ['change'],
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      tabs: [],
      activeTabId: undefined
    };
  },

  mounted() {
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].id);
    }
  },

  methods: {
    findTab(id) {
      return this.tabs.find(tab => tab.id === id);
    },

    selectTab(selectedTabId) {
      const selectedTab = this.findTab(selectedTabId);

      if (!selectedTab || selectedTab.disabled) {
        return;
      }

      this.tabs.forEach(tab => {
        tab.isActive = tab.id === selectedTab.id;
      });

      if (this.activeTabId !== undefined) {
        this.$emit('change', {
          id: this.activeTabId
        });
      }

      this.activeTabId = selectedTab.id;
    },

    activeTab() {
      return this.activeTabId;
    }

  }
};

const _hoisted_1$1 = {
  class: "tabs-container"
};
const _hoisted_2$1 = {
  key: 0,
  class: "tab-item tab-action"
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1$1, [createVNode("ul", {
    class: ["tab", {
      'tab-block': this.block
    }]
  }, [(openBlock(true), createBlock(Fragment, null, renderList($data.tabs, tab => {
    return openBlock(), createBlock("li", {
      class: ["tab-item", {
        active: tab.isActive
      }]
    }, [createVNode("a", {
      href: "#",
      onClick: withModifiers($event => $options.selectTab(tab.id), ["prevent"]),
      class: {
        'disabled': tab.disabled
      }
    }, toDisplayString(tab.label), 11, ["onClick"])], 2);
  }), 256)), 'action' in _ctx.$slots ? (openBlock(), createBlock("li", _hoisted_2$1, [renderSlot(_ctx.$slots, "action")])) : createCommentVNode("", true)], 2), renderSlot(_ctx.$slots, "default")]);
}

var css_248z$1 = ".tab .tab-item a.disabled {\n  cursor: default;\n  opacity: 0.5;\n  pointer-events: none;\n}\n.tab .tab-item a:focus {\n  box-shadow: none;\n}";
styleInject(css_248z$1);

script$2.render = render$2;

var script$1 = {
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

  data() {
    return {
      isActive: false
    };
  },

  created() {
    this.$parent.tabs.push(this);
  }

};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.disabled ? withDirectives((openBlock(), createBlock("section", {
    key: 0,
    class: "tab-panel",
    "aria-hidden": !$data.isActive,
    id: `tab-${$props.id}`,
    role: "tabpanel"
  }, [renderSlot(_ctx.$slots, "default")], 8, ["aria-hidden", "id"])), [[vShow, $data.isActive]]) : createCommentVNode("", true);
}

script$1.render = render$1;

var script = {
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

  data() {
    return {
      visible: this.show
    };
  },

  watch: {
    show() {
      this.visible = this.show;
    }

  },
  computed: {
    parsedContent() {
      const content = typeof this.content === 'string' ? {
        message: this.content
      } : this.content;
      return {
        title: '',
        message: '',
        ...content
      };
    },

    title() {
      return this.parsedContent.title;
    },

    message() {
      return this.parsedContent.message;
    }

  }
};

const _hoisted_1 = {
  key: 0,
  class: "toast-wrapper"
};
const _hoisted_2 = {
  key: 0,
  class: "toast-title"
};
const _hoisted_3 = {
  class: "toast-message"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Teleport, {
    to: "body"
  }, [$data.visible ? (openBlock(), createBlock("div", _hoisted_1, [createVNode("div", {
    class: ["toast", $props.type ? `toast-${$props.type}` : '']
  }, [createVNode("button", {
    class: "btn btn-clear float-right",
    onClick: _cache[1] || (_cache[1] = $event => $data.visible = false)
  }), $options.title ? (openBlock(), createBlock("h6", _hoisted_2, toDisplayString($options.title), 1)) : createCommentVNode("", true), createVNode("p", _hoisted_3, toDisplayString($options.message), 1)], 2)])) : createCommentVNode("", true)]);
}

var css_248z = ".toast-wrapper {\n  left: 50%;\n  min-width: 10rem;\n  position: absolute;\n  top: 0.5rem;\n  transform: translateX(-50%);\n  z-index: 410;\n}";
styleInject(css_248z);

script.render = render;

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Autocomplete: script$9,
  Calendar: script$8,
  Dropdown: script$7,
  InputNumber: script$5,
  InputDate: script$6,
  Modal: script$4,
  Pagination: script$3,
  Tabs: script$2,
  Tab: script$1,
  Toast: script
});

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
    timeout: 5,
    // seconds
    ...options
  };
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

function primary(content, options = {}) {
  return show(content, { ...options,
    type: 'primary'
  });
}

function success(content, options = {}) {
  return show(content, { ...options,
    type: 'success'
  });
}

function warning(content, options = {}) {
  return show(content, { ...options,
    type: 'warning'
  });
}

function error(content, options = {}) {
  return show(content, { ...options,
    type: 'error'
  });
}

function info(content, options = {}) {
  return show(content, { ...options,
    type: 'info'
  });
}

function setup(app) {
  appInstance = app;
  app.config.globalProperties.$toast = {
    show,
    primary,
    success,
    warning,
    error,
    info,
    close
  };
}

var plugins = /*#__PURE__*/Object.freeze({
  __proto__: null,
  toast: setup
});

// Import vue components

const install = function installPlugin(app, options = {}) {
  init(options); // Register components

  const prefix = getPrefix();

  for (const component in components) {
    const tagName = `${prefix}${component}`.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
    app.component(tagName, components[component]);
  } // Register plugins


  for (const plugin in plugins) {
    plugins[plugin](app);
  }
}; // Create module definition for Vue.use()

export default install;
export { script$9 as Autocomplete, script$8 as Calendar, script$7 as Dropdown, script$6 as InputDate, script$5 as InputNumber, script$4 as Modal, script$3 as Pagination, script$1 as Tab, script$2 as Tabs, script as Toast };
