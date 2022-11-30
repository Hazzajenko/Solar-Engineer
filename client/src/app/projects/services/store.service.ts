import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { selectProjectByRouteParams } from '../project-id/services/store/projects/projects.selectors'

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  getProject = this.store.select(selectProjectByRouteParams)

  constructor(private http: HttpClient, private store: Store<AppState>) {}
}
