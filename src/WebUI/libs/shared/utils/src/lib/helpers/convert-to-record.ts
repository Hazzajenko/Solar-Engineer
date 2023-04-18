export function toRecord<T extends { [K in keyof T]: string | number | symbol }, K extends keyof T>(
  array: T[],
  selector: K,
): Record<T[K], T> {
  return array.reduce((acc, item) => ((acc[item[selector]] = item), acc), {} as Record<T[K], T>)
}

const arr = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' },
]

const record = toRecord(arr, 'id')

/*

 const arr2 = [
 {name: 'country', value: 'Austria'},
 {name: 'age', value: 30},
 {name: 'city', value: 'Vienna'},
 ];

 const obj = Object.fromEntries(
 arr2.map(obj => [obj.name, obj.value])
 );
 */
