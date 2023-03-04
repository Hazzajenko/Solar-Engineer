import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { LinksActions, LinksSelectors } from '@project-id/data-access/store'
import { PanelModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LinksFacade {
  private store = inject(Store)

  loaded$ = this.store.select(LinksSelectors.selectLinksLoaded)
  allLinks$ = this.store.select(LinksSelectors.selectAllLinks)
  linksFromRoute$ = this.store.select(LinksSelectors.selectLinksByRouteParams)
  toLinkId$ = this.store.select(LinksSelectors.selectToLinkId)
  toLinkIdWithType$ = this.store.select(LinksSelectors.selectToLinkIdWithType)
  state$ = this.store.select(LinksSelectors.selectLinksState)

  init(projectId: number) {
    this.store.dispatch(LinksActions.initLinks({ projectId }))
  }

  get allLinks() {
    return firstValueFrom(this.allLinks$)
  }

  // getSelectedLinks(links, action.panelId)
  get state() {
    return firstValueFrom(this.state$)
  }

  get toLinkId() {
    return firstValueFrom(this.toLinkId$)
  }

  get toLinkIdWithType() {
    return firstValueFrom(this.toLinkIdWithType$)
  }

  linkById(linkId: string) {
    return firstValueFrom(this.store.select(LinksSelectors.selectLinkById({ linkId })))
  }

  linkById$(linkId: string) {
    return this.store.select(LinksSelectors.selectLinkById({ linkId }))
  }

  linksByPanels$(panels: PanelModel[]) {
    return this.store.select(LinksSelectors.selectLinksByPanels({ panels }))
  }

  linksByPanels(panels: PanelModel[]) {
    return firstValueFrom(this.store.select(LinksSelectors.selectLinksByPanels({ panels })))
  }

  linksByPanelId$(panelId: string) {
    return this.store.select(LinksSelectors.selectLinksByPanelId({ panelId }))
  }

  linksByPanelId(panelId: string) {
    return firstValueFrom(this.store.select(LinksSelectors.selectLinksByPanelId({ panelId })))
  }

  linksByStringId$(stringId: string) {
    return this.store.select(LinksSelectors.selectLinksByStringId({ stringId }))
  }

  linksByStringId(stringId: string) {
    return firstValueFrom(this.store.select(LinksSelectors.selectLinksByStringId({ stringId })))
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

}
