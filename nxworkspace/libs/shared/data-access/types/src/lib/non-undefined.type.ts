export type NonUndefined<T> = T extends undefined ? never : T

export type NonUndefinedFields<T> = {
  [P in keyof T]: NonUndefined<T[P]>
}
