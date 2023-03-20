import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NgIf } from '@angular/common'
import { MenuItemModel } from './menu-item.model'

@Component({
  selector: 'app-button-builder',
  templateUrl: 'menu-builder.component.html',
  styles: [],
  standalone: true,
  imports: [
    NgIf,
  ],
})
export class MenuBuilderComponent implements OnInit {
  @Input() menuItems: MenuItemModel[] = []
  @Output() menuItemSelected = new EventEmitter<MenuItemModel>()

  ngOnInit(): void {
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
  }

  onMenuItemSelected(menuItem: MenuItemModel) {
    this.menuItemSelected.emit(menuItem)
  }

}
