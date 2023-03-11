export interface IBlockJson<T> {
  fromSerialized<T>(serialized: string): T
}
