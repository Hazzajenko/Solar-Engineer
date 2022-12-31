import { PanelLinkModel, PanelModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {LinksSelectors, LinksActions} from '@project-id/data-access/store'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LinksFacade {
  private readonly store = inject(Store)

  loaded$ = this.store.select(LinksSelectors.selectLinksLoaded)
  allLinks$ = this.store.select(LinksSelectors.selectAllLinks)
  linksFromRoute$ = this.store.select(LinksSelectors.selectLinksByRouteParams)
  toLinkId$ = this.store.select(LinksSelectors.selectToLinkId)
  toLinkIdWithType$ = this.store.select(LinksSelectors.selectToLinkIdWithType)
  state$ = this.store.select(LinksSelectors.selectLinksState)

  init(projectId: number) {
    this.store.dispatch(LinksActions.initLinks({ projectId }))
  }

  get state() {
    return firstValueFrom(this.state$)
  }

  get toLinkId() {
    return firstValueFrom(this.toLinkId$)
  }

  get toLinkIdWithType() {
    return firstValueFrom(this.toLinkIdWithType$)
  }

  linksByPanels(panels: PanelModel[]) {
    return this.store.select(LinksSelectors.selectLinksByPanels({ panels }))
  }

  isPanelExistingNegativeLink$(panelId: string) {
    return this.store.select(LinksSelectors.isPanelExistingNegativeLink({ panelId }))
  }

  isPanelExistingNegativeLink(panelId: string) {
    return firstValueFrom(
      this.store.select(LinksSelectors.isPanelExistingNegativeLink({ panelId })),
    )
  }

  isPanelExistingPositiveLink$(panelId: string) {
    return this.store.select(LinksSelectors.isPanelExistingPositiveLink({ panelId }))
  }

  isPanelExistingPositiveLink(panelId: string) {
    return firstValueFrom(this.store.select(LinksSelectors.isPanelExistingPositiveLink({ panelId })))
  }

  startLinkPanel(panelId: string) {
    this.store.dispatch(LinksActions.startLinkPanel({ panelId }))
  }

  startLinkPanelV2(panelId: string) {
    this.store.dispatch(LinksActions.startLinkPanel({ panelId }))
    return LinksActions.startLinkPanel({ panelId }).type
  }

  createLink(link: PanelLinkModel) {
    this.store.dispatch(LinksActions.addLink({ link }))
  }

  createLinkV2(link: PanelLinkModel) {
    this.store.dispatch(LinksActions.addLink({ link }))
    return LinksActions.addLink({ link }).type
  }

  clearLinkState() {
    this.store.dispatch(LinksActions.clearLinksState())
  }
}
