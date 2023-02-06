import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'

import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'

import { AppUserLinkModel, GroupChatMessageMemberModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'
import { GetCdnUrlStringPipe, GetFullUrlPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'

@Component({
  selector: 'app-app-user-item-component',
  templateUrl: './app-user-item.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ShowHideComponent,
    NgClass,
    MatCardModule,
    DatePipe,
    TimeDifferenceFromNowPipe,
    GetFullUrlPipe,
    GetCdnUrlStringPipe,
    MatMenuModule,
  ],
  standalone: true,
  providers: [DatePipe],
})
export class AppUserItemComponent {
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  @Input() appUser?: AppUserLinkModel
  @Input() selected = false
  @Output() selectEvent = new EventEmitter<AppUserLinkModel>()

  onRightClick(event: MouseEvent) {
    if (!this.appUser) return
    event.preventDefault()
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    if (!this.selected) this.selectEvent.emit(this.appUser)
    this.matMenuTrigger.openMenu()
  }

  select() {
    if (!this.appUser) return
    this.selectEvent.emit(this.appUser)
  }
}
