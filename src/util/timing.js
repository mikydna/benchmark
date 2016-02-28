
export function now() {
  const [s, ns] = process.hrtime();
  return Math.floor((s * 1e9) + ns);
}
