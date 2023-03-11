import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LinksActions } from '../../store'
import { PanelLinkModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class LinksRepository {
  private store = inject(Store)

  init(projectId: number) {
    this.store.dispatch(LinksActions.initLinks({ projectId }))
  }

  startLinkPanel(panelId: string) {
    this.store.dispatch(LinksActions.startLinkPanel({ panelId }))
  }

  createLink(link: PanelLinkModel) {
    this.store.dispatch(LinksActions.addLink({ link }))
  }

  loadPanelLinksSuccess(links: PanelLinkModel[]) {
    this.store.dispatch(LinksActions.loadLinksSuccess({ links }))
  }

  deleteLink(linkId: string) {
    this.store.dispatch(LinksActions.deleteLink({ linkId }))
  }

  clearLinkState() {
    this.store.dispatch(LinksActions.clearLinksState())
  }
}
