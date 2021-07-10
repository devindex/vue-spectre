export function randomHash() {
  return Math.random().toString(32).slice(-8);
}
