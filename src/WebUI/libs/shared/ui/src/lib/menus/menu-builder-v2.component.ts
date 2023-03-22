/*
 import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
 import { CommonModule } from '@angular/common'
 import { MenuItemModel } from './menu-item.model'
 import { MatMenu, MatMenuModule } from '@angular/material/menu'

 @Component({
 selector: 'app-menu-builder-v2',
 template: `
 <!--    <mat-menu #menu="matMenu" [overlapTrigger]="false">
 <ng-container *ngIf="header">
 <h3 mat-menu-item>{{header}}</h3>
 <mat-divider></mat-divider>
 </ng-container>
 <ng-container *ngFor="let menuItem of menuItems">
 <ng-container *ngIf="menuItem.hasChildren">
 <button mat-menu-item [matMenuTriggerFor]="menuItem.childrenMenu">
 <mat-icon>{{menuItem.icon}}</mat-icon>
 <span>{{menuItem.label}}</span>
 </button>
 <mat-menu #menuItemChildrenMenu="matMenu" [overlapTrigger]="false">
 <ng-container *ngFor="let child of menuItem.children">
 <button mat-menu-item (click)="onMenuItemSelected(child)">
 <mat-icon>{{child.icon}}</mat-icon>
 <span>{{child.label}}</span>
 </button>
 </ng-container>
 </mat-menu>
 </ng-container>
 <ng-container *ngIf="!menuItem.hasChildren">
 <button mat-menu-item (click)="onMenuItemSelected(menuItem)">
 <mat-icon>{{menuItem.icon}}</mat-icon>
 <span>{{menuItem.label}}</span>
 </button>
 </ng-container>
 </ng-container>
 </mat-menu>-->
 <!--    <h1 *ngIf='header'> {{header}}</h1>-->
 <ng-content select='div[role=heading]'></ng-content>
 <ul
 class='py-2 text-sm text-gray-700 dark:text-gray-200'
 aria-labelledby='dropdownMenuIconButton'
 >
 <li>
 <a class='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
 {{ menuItem.name }}
 </a>
 </li>
 </ul>
 <!--    <ng-content select='ul[role=list]'></ng-content>-->

 `,
 styles: [],
 standalone: true,
 imports: [
 CommonModule,
 MatMenuModule,
 ],
 })
 export class MenuBuilderV2Component implements OnInit, AfterViewInit {

 @Input() header?: string

 @ViewChild('menu', { static: true }) menu!: MatMenu
 @Output() matMenuEventEmitter = new EventEmitter<MatMenu>()

 ngAfterViewInit(): void {
 console.log(this.menu)
 this.matMenuEventEmitter.emit(this.menu)
 }

 ngOnInit(): void {
 /!*    this.menuItems.forEach(menuItem => {
 if (menuItem.hasChildren) {
 menuItem.children?.forEach(child => {
 child.route = `${menuItem.route}/${child.route}`
 })
 }
 },
 )*!/
 }

 onMenuItemSelected(menuItem: MenuItemModel) {
 menuItem.click?.()
 // this.menuItemSelected.emit(menuItem)
 }
 }
 */
