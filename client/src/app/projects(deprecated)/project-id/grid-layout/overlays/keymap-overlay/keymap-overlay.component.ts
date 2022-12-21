import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { Observable } from 'rxjs'
import { selectSelectedStringId } from '../../../services/store/selected/selected.selectors'
import { map } from 'rxjs/operators'
import { AsyncPipe, NgIf } from '@angular/common'

@Component({
  selector: 'app-keymap-overlay-component',
  templateUrl: 'keymap-overlay-component.component.html',
  styleUrls: ['keymap-overlay.component.scss'],
  imports: [NgIf, AsyncPipe],
  standalone: true,
})
export class KeymapOverlayComponent implements OnInit {
  stringSelected$!: Observable<boolean>
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.stringSelected$ = this.store
      .select(selectSelectedStringId)
      .pipe(map((stringId) => !!stringId))
  }
}
