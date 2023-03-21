export function chainError(err: Error, func?: (err: any) => void) {
  if (func) {
    func(err)
  }
  return Promise.reject(err)
}
