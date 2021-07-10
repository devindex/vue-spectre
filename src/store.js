export const state = {};

export function get(key, defaultValue = null) {
  return key in state ? state[key] : defaultValue;
}

export function set(key, value) {
  state[key] = value;
}

export function getOrSet(key, initialValue) {
  if (!key in state) {
    state[key] = initialValue;
  }
  return state[key];
}

export default state;
