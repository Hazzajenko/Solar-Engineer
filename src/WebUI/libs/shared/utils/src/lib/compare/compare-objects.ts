export function compareObjects({ o1, o2 }: { o1: any; o2: any }) {
  for (const p in o1) {
    // eslint-disable-next-line no-prototype-builtins
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false
      }
    }
  }
  for (const p in o2) {
    // eslint-disable-next-line no-prototype-builtins
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false
      }
    }
  }
  return true
}
