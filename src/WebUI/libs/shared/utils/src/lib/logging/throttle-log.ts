import { throttle } from 'lodash'

export const throttleLog = throttle((...args: any[]) => console.log(...args), 1000)
