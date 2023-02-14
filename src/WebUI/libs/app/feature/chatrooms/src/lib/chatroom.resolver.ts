import { inject, Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { UiStoreService } from '@project-id/data-access/facades'
import { WindowSizeModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'


@Injectable({
  providedIn: 'root',
})
export class ChatroomResolver implements Resolve<Observable<WindowSizeModel>> {
  private uiStore = inject(UiStoreService)

  resolve(): Observable<WindowSizeModel> {
    return this.uiStore.select.windowSize$
  }
}
