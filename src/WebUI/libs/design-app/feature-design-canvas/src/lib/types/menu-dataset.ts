export type MenuDataset = {
	id: string
	type: string
	angle: string
	stringId?: string
}

export const menuDataset = (
	id: string,
	type: string,
	angle: string,
	stringId?: string,
): MenuDataset => ({
	id,
	type,
	angle,
	stringId,
})

/*
 export const domStringMapToMenuDataSet = (stringMap: DOMStringMap): MenuDataset => {
 /!*	if (!obj || !obj['id'] || !obj['type'] || !obj['angle']) {
 console.log('Invalid DOMStringMap', obj)
 console.log('Invalid DOMStringMap', obj['id'])
 console.log('Invalid DOMStringMap', obj['type'])
 console.log('Invalid DOMStringMap', obj['angle'])

 /!*		console.log('Invalid DOMStringMap', obj)
 console.log('Invalid DOMStringMap', obj)
 console.log('Invalid DOMStringMap', obj)*!/
 // throw new Error('Invalid DOMStringMap')
 return menuDataset('', '', '')
 }*!/
 /!*	if (!('id' in obj) || !('type' in obj) || !('angle' in obj)) {
 throw new Error('Invalid DOMStringMap')
 }*!/
 /!*	if (!('id' in obj) && !('type' in obj) && !('angle' in obj)) {
 throw new Error('Invalid DOMStringMap')
 }
 if (!obj.id || !obj.type || !obj.angle) {*!/
 // obj.id
 const obj = Object.fromEntries(Array.from(Object.entries(stringMap)))

 // const obj = Object.fromEntries(Object.entries(stringMap).map(([key, value]) => [key, value]))
 // const obj = Object.fromEntries(Object.entries(stringMap).map(([key, value]) => [key, value]))
 /!*	if (!obj || !obj['id'] || !obj['type'] || !obj['angle']) {
 throw new Error('Invalid DOMStringMap')
 }*!/
 console.log('obj', obj)
 if (!obj || !obj['id'] || !obj['type'] || !obj['angle']) throw new Error('Invalid DOMStringMap')
 return menuDataset(obj['id'], obj['type'], obj['angle'])
 // obj['id']
 /!*	if ('id' in stringMap && 'type' in stringMap && 'angle' in stringMap) {
 if (!stringMap || !stringMap['id'] || !stringMap['type'] || !stringMap['angle']) throw new Error('Invalid DOMStringMap')
 return menuDataset(stringMap['id'], stringMap['type'], stringMap['angle'])
 }
 console.log('Invalid DOMStringMap', stringMap)
 throw new Error('Invalid DOMStringMap')*!/
 /!*		if (obj.id === undefined || obj.type === undefined || obj.angle === undefined) {
 return menuDataset(obj.id, obj.type, obj.angle)
 }*!/
 /!*	if ('id' in obj && 'type' in obj && 'angle' in obj) {
 if (obj.id === undefined || obj.type === undefined || obj.angle === undefined) {
 return menuDataset(obj.id, obj.type, obj.angle)
 }*!/
 // return menuDataset(obj.id, obj.type, obj.angle, obj.stringId)
 // return menuDataset(obj['id'], obj['type'], obj['angle'], obj['stringId'])
 }
 */

export const domStringMapToPanelMenuDataSet = (obj: DOMStringMap): MenuDataset => {
	if (!obj || !obj['id'] || !obj['type'] || !obj['angle'] || !obj['stringId']) {
		throw new Error('Invalid DOMStringMap')
	}
	return menuDataset(obj['id'], obj['type'], obj['angle'], obj['stringId'])
}
