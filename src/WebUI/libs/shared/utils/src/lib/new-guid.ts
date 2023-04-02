import { v4 as uuidv4 } from 'uuid'

export function newGuid() {
  return uuidv4().toString()
}