import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

export function newGuid() {
  return uuidv4().toString()
}

export type Guid = ReturnType<typeof newGuid>

export function validateGuid(guid: string) {
  return uuidValidate(guid)
}

export function isGuid(guid: string): guid is Guid {
  return uuidValidate(guid)
}