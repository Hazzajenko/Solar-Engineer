import { ScrollingModule } from '@angular/cdk/scrolling'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
// import { MessagesComponent } from '@app/messages'
import { LetDirective } from '@ngrx/component'
import { ShowHideComponent } from '@shared/ui/show-hide'

@Component({
  selector: 'app-message-bar-component',
  templateUrl: './message-bar.component.html',
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
    ReactiveFormsModule,
    ShowHideComponent,
    NgClass,
    MatCardModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,

    MatCheckboxModule,
    LetDirective,
    // MessagesComponent,
  ],
  standalone: true,
})
export class MessageBarComponent {
  messageControl = new FormControl('', [])
  @Output() sendMessageEvent = new EventEmitter<string>()

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  sendGroupChatMessage() {
    if (!this.messageControl.value) return
    this.sendMessageEvent.emit(this.messageControl.value)
    this.messageControl.reset()
  }
}
