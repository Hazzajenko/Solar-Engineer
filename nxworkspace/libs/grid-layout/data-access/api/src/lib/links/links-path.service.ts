import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'

import { map, switchMap } from 'rxjs/operators'
import {
  DisconnectionPointsEntityService,
  PanelLinksEntityService,
  PanelsEntityService,
  SelectedStateActions,
} from '@grid-layout/data-access/store'
import { firstValueFrom } from 'rxjs'
import { PanelModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { WarmColor } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  private store = inject(Store<AppState>)
  private panelsEntity = inject(PanelsEntityService)
  private panelLinksEntity = inject(PanelLinksEntityService)
  private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)

  orderPanelsInLinkOrder(stringId: string) {
    return firstValueFrom(
      this.panelsEntity.entities$
        .pipe(map((panels) => panels.filter((p) => p.stringId === stringId)))
        .pipe(
          switchMap((stringPanels) =>
            this.panelLinksEntity.entities$
              .pipe(
                map((links) =>
                  links.filter((l) => stringPanels.map((sps) => sps.id).includes(l.positiveToId!)),
                ),
              )
              .pipe(map((stringLinks) => ({ stringPanels, stringLinks }))),
          ),
        )
        .pipe(
          switchMap((res) =>
            this.disconnectionPointsEntity.entities$.pipe(
              map((dps) => ({
                stringPanels: res.stringPanels,
                stringLinks: res.stringLinks,
                disconnectionPoint: dps.find((d) => d.stringId === stringId),
              })),
            ),
          ),
        ),
    ).then((res) => {
      const starterLinks = res.stringLinks.filter((link) => {
        const firstPanel = res.stringPanels.find((x) => x.id === link.positiveToId)

        const doesFirstHavePreviousLink = res.stringLinks.find(
          (x) => x.negativeToId === firstPanel?.id,
        )

        if (doesFirstHavePreviousLink) {
          return undefined
        } else {
          return link
        }
      })
      let linkPathMap = new Map<string, { link: number; count: number; color: string }>()
      // let linkPathMap = new Map<string, number>()
      let linkCounter: number = 0
      let linkColor: WarmColor = WarmColor.Blue
      // let linkColor: LinkColor = LinkColor.VibrantPurple
      for (let starterLink of starterLinks) {
        let panelCounter: number = 1
        let job = true

        let nextPanel: PanelModel | undefined = res.stringPanels.find(
          (x) => x.id === starterLink.positiveToId,
        )

        while (job) {
          if (nextPanel) {
            linkPathMap.set(nextPanel.id, {
              link: linkCounter,
              count: panelCounter,
              color: linkColor,
            })
            if (panelCounter === 1) {
              const secondPanel = res.stringPanels.find((x) => x.id === starterLink.negativeToId)
              if (secondPanel) {
                nextPanel = secondPanel
              } else {
                linkCounter++
                job = false
              }
            } else {
              const upcomingLink = res.stringLinks.find((x) => x.positiveToId === nextPanel?.id)
              const upcomingPanel = res.stringPanels.find(
                (x) => x.id === upcomingLink?.negativeToId,
              )
              if (upcomingLink && upcomingPanel) {
                nextPanel = upcomingPanel
              } else {
                linkCounter++
                job = false
              }
            }

            panelCounter++
          } else {
            linkCounter++
            job = false
          }
        }

        console.log(linkColor)
        switch (linkColor) {
          case WarmColor.Blue:
            linkColor = WarmColor.Aqua
            break
          case WarmColor.Aqua:
            linkColor = WarmColor.Cyan
            break

          case WarmColor.Cyan:
            linkColor = WarmColor.Red
            break
          case WarmColor.Red:
            linkColor = WarmColor.Green
            break
          case WarmColor.Green:
            linkColor = WarmColor.Blue
            break
        }
        /*        switch (linkColor) {
                  case LinkColor.VibrantPurple:
                    linkColor = LinkColor.VibrantGreen
                    break
                  case LinkColor.VibrantGreen:
                    linkColor = LinkColor.VibrantYellow
                    break

                  case LinkColor.VibrantYellow:
                    linkColor = LinkColor.VibrantRed
                    break
                  case LinkColor.VibrantRed:
                    linkColor = LinkColor.VibrantOrange
                    break
                  case LinkColor.VibrantOrange:
                    linkColor = LinkColor.VibrantPurple
                    break
                }*/
      }
      this.store.dispatch(SelectedStateActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }))
    })
  }
}
