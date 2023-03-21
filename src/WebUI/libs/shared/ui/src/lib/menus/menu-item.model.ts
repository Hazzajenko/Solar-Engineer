export interface MenuItemModel {
  // id: string
  name: string
  icon: string
  route: string
  // onClick?: EventEmitter<any>
  // click?: () => void
  hasChildren?: boolean

  children?: MenuItemModel[]
}
