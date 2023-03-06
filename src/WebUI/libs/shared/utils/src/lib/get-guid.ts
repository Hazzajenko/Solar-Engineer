import { v4 as uuidv4 } from 'uuid'

export function getGuid() {
  return uuidv4().toString()
  // deprecated
  /*  return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = (Math.random() * 16) | 0,
        // tslint:disable-next-line:no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })*/
}
