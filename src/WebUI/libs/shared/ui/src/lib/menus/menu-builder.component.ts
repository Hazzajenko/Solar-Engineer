import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MenuItemModel } from './menu-item.model'
import { MatMenu, MatMenuModule } from '@angular/material/menu'

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
export class MenuBuilderComponent extends MatMenu implements OnInit {
  @Input() header?: string
  @Input() menuItems: MenuItemModel[] = []
  @Output() menuItemSelected = new EventEmitter<MenuItemModel>()
  @ViewChild(MatMenu) menu!: MatMenu

  // @Output() menu

  override ngOnInit(): void {
    this.menuItems.forEach(menuItem => {
        if (menuItem.hasChildren) {
          menuItem.children?.forEach(child => {
            child.route = `${menuItem.route}/${child.route}`
          })

          // menuItem.onClick = new EventEmitter<any>()
          /*    menuItem.onClick.subscribe(() => {
           this.onMenuItemSelected(menuItem)
           }*/
          /*     menuItem.click = () => {

           }*/
        }
      },
    )
    super.ngOnInit()
  }

  onMenuItemSelected(menuItem: MenuItemModel) {
    this.menuItemSelected.emit(menuItem)
  }

}
