export const getGuid = () => {
  return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // tslint:disable-next-line:no-bitwise
    const r = (Math.random() * 16) | 0,
      // tslint:disable-next-line:no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
