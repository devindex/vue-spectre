<template>
  <div class="calendar">
    <div class="calendar-nav navbar">
      <button class="btn btn-action btn-link" @click="prev" :disabled="!canPrev">
        <slot name="prev-nav">
          <i class="icon icon-arrow-left"></i>
        </slot>
      </button>
      <div class="navbar-primary">{{ headerTitle }}</div>
      <button class="btn btn-action btn-link" @click="next" :disabled="!canNext">
        <slot name="next-nav">
          <i class="icon icon-arrow-right"></i>
        </slot>
      </button>
    </div>
    <div class="calendar-container">
      <div class="calendar-header">
        <div class="calendar-date" v-for="day in daysOfWeek">{{ day }}</div>
      </div>
      <div class="calendar-body">
        <div class="calendar-date" :class="dayClasses(day)" v-for="day in days">
          <button class="date-item"
                  :class="{'date-today': day.isToday, active: isActive(day.date)}"
                  @click="select(day)">
            {{ day.day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from '../../utils';
import { get as getLang } from './i18n';

export default {
  props: {
    value: {
      type: Date,
    },
    min: {
      type: Date,
    },
    max: {
      type: Date,
    },
    highlights: {
      type: Array,
      default: () => [],
    },
    daysOfWeek: {
      type: Array,
      default: () => getLang(getConfig('locale')).daysOfWeek,
    },
    months: {
      type: Array,
      default: () => getLang(getConfig('locale')).months,
    },
  },
  data() {
    return {
      today: this.onlyDate(new Date()),
      month: this.onlyDate(new Date(), true, true),
      days: [],
    }
  },
  mounted() {
    this.setMonth(this.value || new Date());
    this.mount();
  },
  watch: {
    value(date) {
      this.setMonth(date);
      this.mount();
    },
    highlights() {
      this.mount();
    }
  },
  methods: {
    reset() {
      this.month = this.onlyDate(this.value, true, true);
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
      this.$emit('input', data.date);
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
            month: 'current',
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
      }
      while(calendar.getMonth() !== nextMonth || this.days.length < 42);
    },
    format(date) {
      return [
        date.getFullYear(),
        this.zeroFill(date.getMonth() + 1),
        this.zeroFill(date.getDate())
      ].join('-')
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
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime()
          && this.onlyDate(this.max, true).getTime() >= date.getTime();
      } else if (this.min) {
        enabled = this.onlyDate(this.min, true).getTime() <= date.getTime();
      } else if (this.max) {
        enabled = this.onlyDate(this.max, true).getTime() >= date.getTime();
      }

      return enabled;
    },
    isActive(date) {
      if (this.value) {
        return this.onlyDate(this.value, true).getTime() === date.getTime()
      }
      return false;
    },
    dayClasses(day) {
      return {
        disabled: day.ctrl.isEnabled === false || !day.ctrl.isActiveMonth,
        highlight: day.ctrl.isHighlight,
        [day.ctrl.month + '-month']: true
      }
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
}
</script>
