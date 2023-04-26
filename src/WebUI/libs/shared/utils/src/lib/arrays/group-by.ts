/*export function groupBy<T>(arr: T[], fn: (item: T) => any) {
 return arr.reduce<Record<string, T[]>>((prev, curr) => {
 const groupKey = fn(curr)
 const group = prev[groupKey] || []
 group.push(curr)
 return { ...prev, [groupKey]: group }
 }, {})
 }

 const testArr = [
 { id: 1, name: 'a' },
 { id: 2, name: 'b' },
 { id: 3, name: 'a' },
 ]

 const result = groupBy(testArr, (item) => item.name)

 // result['id']

 console.log(result)*/

const products = [
  { name: 'apples', category: 'fruits' },
  { name: 'oranges', category: 'fruits' },
  { name: 'potatoes', category: 'vegetables' },
]

/*const groupByCategory = products.groupBy((product) => {
 return product.category
 })*/

function groupByFunc<
  RetType extends PropertyKey,
  T, // no longer need any requirements on T since the grouper can do w/e it wants
  Func extends (arg: T) => RetType,
>(arr: T[], mapper: Func): Record<RetType, T[]> {
  return arr.reduce((accumulator, val) => {
    const groupedKey = mapper(val)
    if (!accumulator[groupedKey]) {
      accumulator[groupedKey] = []
    }
    accumulator[groupedKey].push(val)
    return accumulator
  }, {} as Record<RetType, T[]>)
}

const test = groupByFunc([6.1, 4.2, 6.3], Math.floor)

const groupByCategory = groupByFunc(products, (product) => {
  return product.category
})

// console.log(groupByCategory)
const apples = groupByCategory['apples']

export type MapValuesToKeysIfAllowed<T> = {
  [K in keyof T]: T[K] extends PropertyKey ? K : never
}
export type Filter<T> = MapValuesToKeysIfAllowed<T>[keyof T]

interface Foo {
  num: number
  someLiteral: 'a' | 'b' | 'c'
  object: Record<string, any>
}

const vals: Foo[] = [
  { num: 1, someLiteral: 'a', object: { key: 'value' } },
  { num: 2, someLiteral: 'a', object: { key: 'diffValue' } },
  { num: 1, someLiteral: 'b', object: {} },
]

export function groupBy<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
  arr: T[],
  key: Key,
): Record<T[Key], T[]> {
  return arr.reduce((accumulator, val) => {
    const groupedKey = val[key]
    if (!accumulator[groupedKey]) {
      accumulator[groupedKey] = []
    }
    accumulator[groupedKey].push(val)
    return accumulator
  }, {} as Record<T[Key], T[]>)
}

const nums = groupBy(vals, 'num')
// nums = Record<number, Foo[]>

const literals = groupBy(vals, 'someLiteral')

export function groupInto2dArray<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
  arr: T[],
  key: Key,
): T[][] {
  return Object.values(groupBy(arr, key))
}

// const nums2d = groupInto2dArray(vals, 'num')
// nums2d[0][0].num
export function groupIntoMap<T extends Record<PropertyKey, any>, Key extends Filter<T>>(
  arr: T[],
  key: Key,
): Map<T[Key], T[]> {
  const map = new Map()
  arr.forEach((item) => {
    const groupedKey = item[key]
    const collection = map.get(key)
    if (!collection) {
      map.set(groupedKey, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}

type Pet = {
  type: 'Dog' | 'Cat'
  name: string
}

const pets: Pet[] = [
  { type: 'Dog', name: 'Spot' },
  { type: 'Cat', name: 'Tiger' },
  { type: 'Dog', name: 'Rover' },
  { type: 'Cat', name: 'Leo' },
]

const grouped = groupIntoMap(pets, 'type')

export function mapToObj<T>(m: Map<string, T>): {
  [key: string]: T
} {
  return Array.from(m).reduce((obj, [key, value]) => {
    (obj as any)[key] = value
    return obj
  }, {})
}

// const grouped = groupIntoMap<Pet, 'type'>(pets, 'type')

// literals = Record<"a" | "b" | "c", Foo[]>

// const sad = groupBy(vals, 'object')
/*
 const groupByCategory = products.reduce((group, product) => {
 const { category } = (product(group as any)[category] =
 (group as any)[category] ?? [](group as any)[category].push(product))
 return group
 }, {})

 console.log(groupByCategory)*/

// {
