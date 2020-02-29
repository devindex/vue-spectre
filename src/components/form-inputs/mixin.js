function randomHash() {
  return Math.random().toString(32).slice(-8);
}

export default {
  props: {
    id: String,
    label: String,
    value: String,
  },
  methods: {
    onInput($event) {
      this.$emit('input', $event.target.value);
    },
  },
  computed: {
    inputId() {
      return this.id || randomHash()
    },
    groupId() {
      return `fg-${this.inputId}`;
    }
  },
};
