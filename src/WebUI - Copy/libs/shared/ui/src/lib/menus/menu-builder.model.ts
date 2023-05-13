import { MenuItemModel, MenuItemModelV2 } from '@shared/ui'

export interface MenuBuilderModel {
  header?: string
  menuItems: MenuItemModel[]
}

export interface MenuBuilderModelV2 {
  header?: string
  menuItems: MenuItemModelV2<any>[]
}