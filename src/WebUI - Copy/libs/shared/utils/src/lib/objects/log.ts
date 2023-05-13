export {}

declare global {
  interface Object {
    log(): Record<string, unknown>
  }
}

Object.prototype.log = function () {
  console.log(this)

  return this as Record<string, unknown>
}
