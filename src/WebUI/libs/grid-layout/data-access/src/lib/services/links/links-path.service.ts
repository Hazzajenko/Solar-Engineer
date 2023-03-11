import {
  LinkColor,
  PanelIdPath,
  PanelLinkModel,
  PanelModel,
  PanelPathModel,
  PathModel,
} from '@shared/data-access/models'

import { LinksFacade, PanelsFacade, PathsStoreService, StringsFacade } from '../'

import { inject, Injectable } from '@angular/core'
import { generateDifferentVibrantColorHex } from '@shared/utils'

import { firstValueFrom } from 'rxjs'

import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  private panelsFacade = inject(PanelsFacade)
  private linksFacade = inject(LinksFacade)
  private stringsFacade = inject(StringsFacade)
  private pathsStore = inject(PathsStoreService)

  // private panelsFacade = inject(PanelsFacade)

  orderPanelsInLinkOrder(panels: PanelModel[]) {
    return this.linksFacade.linksByPanels$(panels).pipe(
      map((links) => {
        const starterLinks = links.filter((link) => {
          const firstPanel = panels.find((panel) => panel.id === link.panelPositiveToId)

          const doesFirstHavePreviousLink = links.find(
            (link) => link.panelNegativeToId === firstPanel?.id,
          )

          if (doesFirstHavePreviousLink) {
            return undefined
          } else {
            return link
          }
        })

        const linkPathMap = new Map<string, PanelPathModel>()
        let linkCounter = 0
        let linkColor: LinkColor = LinkColor.SoftGreen

        for (const starterLink of starterLinks) {
          let panelCounter = 1
          let job = true

          let nextPanel: PanelModel | undefined = panels.find(
            (panel) => panel.id === starterLink.panelPositiveToId,
          )

          while (job) {
            if (nextPanel) {
              linkPathMap.set(nextPanel.id, {
                link: linkCounter,
                count: panelCounter,
                color: linkColor,
              })
              if (panelCounter === 1) {
                const secondPanel = panels.find(
                  (panel) => panel.id === starterLink.panelNegativeToId,
                )
                if (secondPanel) {
                  nextPanel = secondPanel
                } else {
                  linkCounter++
                  job = false
                }
              } else {
                const upcomingLink = links.find((link) => link.panelPositiveToId === nextPanel?.id)
                const upcomingPanel = panels.find(
                  (panel) => panel.id === upcomingLink?.panelNegativeToId,
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
        return linkPathMap
        // this.store.dispatch(SelectedStateActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }))
      }),
    )
  }

  async orderPanelsInLinkOrderWithLinkAsync(link: PanelLinkModel) {
    const stringPanels = await this.panelsFacade.panelsByStringId(link.stringId)
    if (!stringPanels) return
    const stringLinks = await this.linksFacade.linksByPanels(stringPanels)
    if (!stringLinks) return
    /*    const panelPathRecord = await this.stringsFacade.panelPathRecordByStringId(link.stringId)
        if (!panelPathRecord) return*/
    const stringLinkPaths = await this.pathsStore.select.pathsByStringId(link.stringId)
    const existingColors = await firstValueFrom(
      this.pathsStore.select
        .pathsByStringId$(link.stringId)
        .pipe(map((paths) => paths.map((path) => path.color))),
    )
    const starterLinks = stringLinks.filter((link) => {
      const firstPanel = stringPanels.find((panel) => panel.id === link.panelPositiveToId)

      const doesFirstHavePreviousLink = stringLinks.find(
        (link) => link.panelNegativeToId === firstPanel?.id,
      )

      if (doesFirstHavePreviousLink) {
        return undefined
      } else {
        return link
      }
    })

    let panelPaths: PanelIdPath[] = []

    starterLinks.forEach((starterLink, linkCounter) => {
      const starterLinkPanelPath = this.updateStringPanelPaths(
        linkCounter,
        stringLinkPaths,
        starterLink,
        stringPanels,
        stringLinks,
        existingColors,
      )

      if (starterLinkPanelPath) {
        panelPaths = panelPaths.concat(starterLinkPanelPath)
      }
    })

    return panelPaths
  }

  async orderPanelsInLinkOrderForSelectedPanel(panelId: string) {
    const panel = await this.panelsFacade.panelById(panelId)
    if (!panel) return
    if (panel.stringId === 'undefined') return
    const stringLinks = await this.linksFacade.linksByStringId(panel.stringId)
    if (!stringLinks) return
    const stringPanels = await this.panelsFacade.panelsByStringId(panel.stringId)
    if (!stringPanels) return
    const selectedPanelLinks = await this.linksFacade.linksByPanelId(panelId)
    console.log(selectedPanelLinks)
    if (!selectedPanelLinks) return
    const starterPosLink = stringLinks.find((link) => link.panelPositiveToId === panelId)
    const starterNegLink = stringLinks.find((link) => link.panelNegativeToId === panelId)
    const positive = this.getPanelPaths(starterPosLink, stringPanels, stringLinks, true)
    const negative = this.getPanelPaths(starterNegLink, stringPanels, stringLinks, false)

    if (positive && negative) {
      return positive.concat(negative)
    } else if (positive) {
      return positive
    } else if (negative) {
      return negative
    }

    return undefined
  }

  updateStringPanelPaths(
    linkCounter: number,
    stringLinkPaths: PathModel[],
    starterLink: PanelLinkModel,
    stringPanels: PanelModel[],
    stringLinks: PanelLinkModel[],
    existingColors: string[],
  ) {
    let panelCounter = 1
    let job = true
    let linkColor = generateDifferentVibrantColorHex(existingColors)
    const panelPaths: PanelIdPath[] = []
    let existingLinkHasBeenSet = false
    let spareLinkCountSpotJob = true

    while (spareLinkCountSpotJob) {
      const isThisCountFree = stringLinkPaths.find((linkPath) => linkPath.link === linkCounter)
      if (isThisCountFree) {
        linkCounter++
      } else {
        spareLinkCountSpotJob = false
      }
    }

    let nextPanel: PanelModel | undefined = stringPanels.find(
      (panel) => panel.id === starterLink.panelPositiveToId,
    )
    while (job) {
      if (nextPanel) {
        if (!existingLinkHasBeenSet) {
          const isExistingInPath = stringLinkPaths.find(
            (linkPath) => linkPath.panelId === nextPanel?.id,
          )
          if (isExistingInPath) {
            linkColor = isExistingInPath.color
            linkCounter = isExistingInPath.link
            existingLinkHasBeenSet = true
          }
        }

        panelPaths.push({
          panelId: nextPanel.id,
          path: {
            link: linkCounter,
            count: panelCounter,
            color: linkColor,
          },
        })
        if (panelCounter === 1) {
          const secondPanel = stringPanels.find(
            (panel) => panel.id === starterLink.panelNegativeToId,
          )
          if (secondPanel) {
            nextPanel = secondPanel
          } else {
            linkCounter++
            job = false
          }
        } else {
          const upcomingLink = stringLinks.find((link) => link.panelPositiveToId === nextPanel?.id)
          const upcomingPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.panelNegativeToId,
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
    if (existingLinkHasBeenSet) {
      return panelPaths.map((panelPath) => {
        return {
          ...panelPath,
          path: {
            ...panelPath.path,
            color: linkColor,
          },
        } as PanelIdPath
      })
    } else {
      return panelPaths
    }
  }

  getPanelPaths(
    starterLink: PanelLinkModel | undefined,
    stringPanels: PanelModel[],
    stringLinks: PanelLinkModel[],
    positive: boolean,
  ) {
    if (!starterLink) return undefined
    const nextPosPanel = stringPanels.find((panel) => panel.id === starterLink.panelPositiveToId)
    const nextNegPanel = stringPanels.find((panel) => panel.id === starterLink.panelNegativeToId)
    let nextPanel = positive ? nextPosPanel : nextNegPanel

    let job = true
    let linkCounter = 0
    const linkColor: LinkColor = LinkColor.SoftGreen
    let panelCounter = 0
    const panelPaths: PanelIdPath[] = []

    while (job) {
      if (nextPanel) {
        panelPaths.push({
          panelId: nextPanel.id,
          path: {
            link: linkCounter,
            count: panelCounter,
            color: linkColor,
          },
        })
        if (panelCounter === 0) {
          const secondPosPanel = stringPanels.find(
            (panel) => panel.id === starterLink.panelNegativeToId,
          )
          const secondNegPanel = stringPanels.find(
            (panel) => panel.id === starterLink.panelPositiveToId,
          )
          const secondPanel = positive ? secondPosPanel : secondNegPanel
          if (secondPanel) {
            nextPanel = secondPanel
          } else {
            linkCounter++
            job = false
          }
        } else {
          const upcomingPosLink = stringLinks.find(
            (link) => link.panelPositiveToId === nextPanel?.id,
          )
          const upcomingNegLink = stringLinks.find(
            (link) => link.panelNegativeToId === nextPanel?.id,
          )
          const upcomingLink = positive ? upcomingPosLink : upcomingNegLink
          const upcomingPosPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.panelNegativeToId,
          )
          const upcomingNegPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.panelPositiveToId,
          )
          const upcomingPanel = positive ? upcomingPosPanel : upcomingNegPanel
          if (upcomingLink && upcomingPanel) {
            nextPanel = upcomingPanel
          } else {
            linkCounter++
            job = false
          }
        }
        if (positive) {
          panelCounter++
        } else {
          panelCounter--
        }
      } else {
        linkCounter++
        job = false
      }
    }
    return panelPaths
  }
}
