import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

export function newGuid() {
	return uuidv4().toString()
}

export function newGuidT<T extends string>() {
	// console.log(getGuid())
	return uuidv4().toString() as T
}

// Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
export function newGuidWith32DigitsAnd4Dashes<T extends string>() {
	return uuidv4().toString() as T
}

/// https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid

// (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxx
/// guids should be 32 characters long with 4 dashes

export const guidRegex = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i

export type Guid = ReturnType<typeof newGuid>

export function validateGuid(guid: string) {
	return uuidValidate(guid)
}

export function isGuid(guid: string): guid is Guid {
	return uuidValidate(guid)
}
