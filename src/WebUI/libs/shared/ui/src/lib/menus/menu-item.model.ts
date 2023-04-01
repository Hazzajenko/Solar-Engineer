export interface MenuItemModel {
  // id: string
  name: string
  icon: string
  route: string
  // onClick?: EventEmitter<any>
  click?: () => void
  hasChildren?: boolean

  children?: MenuItemModel[]
}

export interface MenuItemModelV2<T> {
  name: string
  click?: () => void | ((data: T, ...args: any[]) => void)
  children?: MenuItemModel[]
}
