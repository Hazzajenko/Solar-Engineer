import { Component, inject, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

import { Observable } from 'rxjs'

import { map } from 'rxjs/operators'
import { AsyncPipe, NgIf } from '@angular/common'
import { AppState } from '@shared/data-access/store'
import { selectSelectedStringId } from '@grid-layout/data-access/store'

@Component({
  selector: 'app-keymap-overlay-component',
  templateUrl: 'keymap-overlay-component.component.html',
  styleUrls: ['keymap-overlay.component.scss'],
  imports: [NgIf, AsyncPipe],
  standalone: true,
})
export class KeymapOverlayComponent implements OnInit {
  stringSelected$!: Observable<boolean>
  private store = inject(Store<AppState>)


  ngOnInit() {
    this.stringSelected$ = this.store
      .select(selectSelectedStringId)
      .pipe(map((stringId) => !!stringId))
  }
}
