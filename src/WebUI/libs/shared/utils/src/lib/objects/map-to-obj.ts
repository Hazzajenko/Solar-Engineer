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
import { Dictionary } from '@ngrx/entity';


export const mapToObject = <
  T extends {
    id: string
  },
>(
  array: T[],
): Record<string, T> => {
  return array.reduce((acc, item) => ((acc[item['id']] = item), acc), {} as Record<string, T>)
}

export const mapToDictionary = <
  T extends {
    id: string
  },
>(
  array: T[],
): Dictionary<T> => {
  return array.reduce((acc, item) => ((acc[item['id']] = item), acc), {} as Dictionary<T>)
}

/*
 const arr = [
 { id: '1', name: 'John' },

 { id: '2', name: 'Jane' },
 ]

 const record = mapToObject(arr)*/