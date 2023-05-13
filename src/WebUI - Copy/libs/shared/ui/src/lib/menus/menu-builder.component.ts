import { Component, Input, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatMenu, MatMenuModule } from '@angular/material/menu'
import { MenuBuilderModel } from './menu-builder.model'
import { MenuItemModel } from './menu-item.model'

@Component({
  selector: 'app-menu-builder',
  templateUrl: 'menu-builder.component.html',
  // exportAs: 'matMenu',
  // hostDirectives: [MatMenu],
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
  ],
})
export class MenuBuilderComponent {

  @Input() menuBuilder!: MenuBuilderModel/*
   @Output() menuItemSelected = new EventEmitter<MenuItemModel>()*/

  @ViewChild('menu', { static: true }) menu!: MatMenu

  /*
   onMenuItemSelected(menuItem: MenuItemModel) {
   menuItem.click?.()
   this.menuItemSelected.emit(menuItem)
   }*/

  onClick(menuItem: MenuItemModel) {
    if (menuItem.click == null) {
      console.log('menuItem.click == null', menuItem)
      return
    }
    menuItem.click?.()
  }
}
