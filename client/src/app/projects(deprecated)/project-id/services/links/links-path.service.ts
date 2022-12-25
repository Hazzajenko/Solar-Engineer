import { DisconnectionPointsEntityService } from '../ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { PanelLinksEntityService } from '../ngrx-data/panel-links-entity/panel-links-entity.service'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { JoinsEntityService } from '../ngrx-data/joins-entity/joins-entity.service'
import { firstValueFrom, switchMap } from 'rxjs'
import { CablesEntityService } from '../ngrx-data/cables-entity/cables-entity.service'
import { ItemsService } from '../items.service'
import { BlocksService } from '../store/blocks/blocks.service'
import { map } from 'rxjs/operators'
import { PanelModel } from '../../../models/panel.model'
import { SelectedStateActions } from '../store/selected/selected.actions'

export enum LinkColor {
  SoftBrown = '#E26D60',
  SoftOrange = '#E8A87C',
  SoftPink = '#FF77A9',
  SoftYellow = '#ffe78a',
  SoftRed = '#dd536a',
  SoftCyan = '#20dacb',
  SoftGreen = '#3bf5b1',

  VibrantPurple = '#D500F9',
  VibrantGreen = '#00E676',
  VibrantYellow = '#FFEA00',
  VibrantRed = '#FF1744',
  VibrantOrange = '#FF9100',
  LightPink = '#ff7ee8',
  LightBlue = '#00d1ff',
  LightGreen = '#3bf5b1',
  LightYellow = '#fffa82',
  LightRed = '#FF6659',
  WarmYellow = '#facf5a',
  WarmRed = '#ff5959',
  GreenYellow = '#cdeda7',
  DarkGreen = '#085f63',
  DarkPurple = '#87096e',
  Test = '#hsl(0deg, 100%, 80%)',
}

@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  constructor(
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private linksEntity: PanelLinksEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private cablesEntity: CablesEntityService,
    private itemsService: ItemsService,
    private blocksService: BlocksService,
  ) {}

  orderPanelsInLinkOrder(stringId: string) {
    return firstValueFrom(
      this.panelsEntity.entities$
        .pipe(map((panels) => panels.filter((p) => p.stringId === stringId)))
        .pipe(
          switchMap((stringPanels) =>
            this.linksEntity.entities$
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
      let linkColor: LinkColor = LinkColor.SoftGreen
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
          case LinkColor.SoftGreen:
            linkColor = LinkColor.SoftOrange
            break
          case LinkColor.SoftOrange:
            linkColor = LinkColor.SoftPink
            break

          case LinkColor.SoftPink:
            linkColor = LinkColor.SoftYellow
            break
          case LinkColor.SoftYellow:
            linkColor = LinkColor.SoftRed
            break
          case LinkColor.SoftRed:
            linkColor = LinkColor.SoftGreen
            break
        }
      }
      this.store.dispatch(SelectedStateActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }))
    })
  }
}
