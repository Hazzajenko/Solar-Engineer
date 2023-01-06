import {
  PanelModel,
  LinkColor,
  PanelLinkModel,
  PanelPathModel, PanelIdPath, StringLinkPathModel,
} from '@shared/data-access/models'

import { PanelsFacade, LinksFacade, StringsFacade, PathsStoreService } from '@project-id/data-access/facades'

import { inject, Injectable } from '@angular/core'
import {
  generateDifferentVibrantColorHex,

} from '@shared/utils'

import { firstValueFrom, of } from 'rxjs'

import { combineLatestWith, map, switchMap } from 'rxjs/operators'


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
          const firstPanel = panels.find((panel) => panel.id === link.positiveToId)

          const doesFirstHavePreviousLink = links.find(
            (link) => link.negativeToId === firstPanel?.id,
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
            (panel) => panel.id === starterLink.positiveToId,
          )

          while (job) {
            if (nextPanel) {
              linkPathMap.set(nextPanel.id, {
                link: linkCounter,
                count: panelCounter,
                color: linkColor,
              })
              if (panelCounter === 1) {
                const secondPanel = panels.find((panel) => panel.id === starterLink.negativeToId)
                if (secondPanel) {
                  nextPanel = secondPanel
                } else {
                  linkCounter++
                  job = false
                }
              } else {
                const upcomingLink = links.find((link) => link.positiveToId === nextPanel?.id)
                const upcomingPanel = panels.find(
                  (panel) => panel.id === upcomingLink?.negativeToId,
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

  orderPanelsInLinkOrderWithLink(link: PanelLinkModel) {
    return this.panelsFacade.panelsByStringId$(link.stringId).pipe(
      switchMap(panels => this.linksFacade.linksByPanels$(panels).pipe(
        combineLatestWith(of(panels)),
      )),
      map(([links, panels]) => {
        const starterLinks = links.filter((link) => {
          const firstPanel = panels.find((panel) => panel.id === link.positiveToId)

          const doesFirstHavePreviousLink = links.find(
            (link) => link.negativeToId === firstPanel?.id,
          )

          if (doesFirstHavePreviousLink) {
            return undefined
          } else {
            return link
          }
        })

        const linkPathMap = new Map<string, PanelPathModel>()
        let linkCounter = 0
        // let linkColor: LinkColor = LinkColor.SoftGreen
        let linkColor = ''


        for (const starterLink of starterLinks) {
          let panelCounter = 1
          let job = true

          let nextPanel: PanelModel | undefined = panels.find(
            (panel) => panel.id === starterLink.positiveToId,
          )

          while (job) {
            if (nextPanel) {
              linkPathMap.set(nextPanel.id, {
                link: linkCounter,
                count: panelCounter,
                color: linkColor,
              })
              if (panelCounter === 1) {
                const secondPanel = panels.find((panel) => panel.id === starterLink.negativeToId)
                if (secondPanel) {
                  nextPanel = secondPanel
                } else {
                  linkCounter++
                  job = false
                }
              } else {
                const upcomingLink = links.find((link) => link.positiveToId === nextPanel?.id)
                const upcomingPanel = panels.find(
                  (panel) => panel.id === upcomingLink?.negativeToId,
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
          linkColor = ''
          /*
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
                    }*/
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
    const panelPathRecord = await this.stringsFacade.panelPathRecordByStringId(link.stringId)
    if (!panelPathRecord) return
    const stringLinkPaths = await this.pathsStore.select.pathsByStringId(link.stringId)
    const existingColors = await firstValueFrom(this.pathsStore.select.pathsByStringId$(link.stringId).pipe(
      map(paths => paths.map(path => path.panelPath.color)),
    ))
    const starterLinks = stringLinks.filter((link) => {
      const firstPanel = stringPanels.find((panel) => panel.id === link.positiveToId)

      const doesFirstHavePreviousLink = stringLinks.find(
        (link) => link.negativeToId === firstPanel?.id,
      )

      if (doesFirstHavePreviousLink) {
        return undefined
      } else {
        return link
      }
    })

    // const linkPathMap: PanelPathMap = new Map<PanelId, PanelPathModel>()
    let panelPaths: PanelIdPath[] = []
    // let linkCounter = 0
    // let linkColor: LinkColor = LinkColor.SoftGreen
    // let linkColor = getRandomColor()
    for (const starterLink of starterLinks) {
      const starterLinkPanelPath = this.updateStringPanelPaths(stringLinkPaths, starterLink, stringPanels, stringLinks, existingColors)
      // const starterLinkPanelPath = this.getPanelPaths(starterLink, stringPanels, stringLinks, true)
      if (starterLinkPanelPath) {
        panelPaths = panelPaths.concat(starterLinkPanelPath)

      }
    }
    /*    for (const starterLink of starterLinks) {
          let panelCounter = 1
          let job = true

          let nextPanel: PanelModel | undefined = stringPanels.find(
            (panel) => panel.id === starterLink.positiveToId,
          )
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
              if (panelCounter === 1) {
                const secondPanel = stringPanels.find((panel) => panel.id === starterLink.negativeToId)
                if (secondPanel) {
                  nextPanel = secondPanel
                } else {
                  linkCounter++
                  job = false
                }
              } else {
                const upcomingLink = stringLinks.find((link) => link.positiveToId === nextPanel?.id)
                const upcomingPanel = stringPanels.find(
                  (panel) => panel.id === upcomingLink?.negativeToId,
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
          linkColor = getRandomColor()
        }*/
    // const result = Object.fromEntries(linkPathMap)
    // const yes: PanelPathRecord = result
    // result['sadsa']
    // console.log('RESSSULT', result)
    return panelPaths
    // return linkPathMap
    // return result

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
    const starterPosLink = stringLinks.find(link => link.positiveToId === panelId)
    const starterNegLink = stringLinks.find(link => link.negativeToId === panelId)
    const positive = this.getPanelPaths(starterPosLink, stringPanels, stringLinks, true)
    const negative = this.getPanelPaths(starterNegLink, stringPanels, stringLinks, false)
    // return positive && negative ? positive.concat(negative) : positive || negative
    if (positive && negative) {
      return positive.concat(negative)
    } else if (positive) {
      return positive
    } else if (negative) {
      return negative
    }

    return undefined
  }

  updateStringPanelPaths(stringLinkPaths: StringLinkPathModel[], starterLink: PanelLinkModel, stringPanels: PanelModel[], stringLinks: PanelLinkModel[], existingColors: string[]) {
    let panelCounter = 1
    let job = true
    let linkCounter = 0
    // let linkColor = generateWarmColorHex()
    let linkColor = generateDifferentVibrantColorHex(existingColors)
    // let linkColor = generateVibrantColorHex()

    // let linkColor = getRandomColorHex()
    // let linkColor = getRandomColor()
    const panelPaths: PanelIdPath[] = []
    let existingLinkHasBeenSet = false


    let spareLinkCountSpotJob = true

    while (spareLinkCountSpotJob) {
      const isThisCountFree = stringLinkPaths.find(linkPath => linkPath.panelPath.link === linkCounter)
      if (isThisCountFree) {
        linkCounter++
      } else {
        spareLinkCountSpotJob = false
      }
    }

    let nextPanel: PanelModel | undefined = stringPanels.find(
      (panel) => panel.id === starterLink.positiveToId,
    )
    while (job) {
      if (nextPanel) {
        if (!existingLinkHasBeenSet) {
          const isExistingInPath = stringLinkPaths.find(linkPath => linkPath.panelId === nextPanel?.id)
          if (isExistingInPath) {
            linkColor = isExistingInPath.panelPath.color
            linkCounter = isExistingInPath.panelPath.link
            existingLinkHasBeenSet = true
          }
        }

        // linkColor = isExistingInPath ? isExistingInPath.panelPath.color : linkColor
        panelPaths.push({
          panelId: nextPanel.id,
          path: {
            link: linkCounter,
            count: panelCounter,
            color: linkColor,
          },
        })
        if (panelCounter === 1) {
          const secondPanel = stringPanels.find((panel) => panel.id === starterLink.negativeToId)
          if (secondPanel) {
            nextPanel = secondPanel
          } else {
            linkCounter++
            job = false
          }
        } else {
          const upcomingLink = stringLinks.find((link) => link.positiveToId === nextPanel?.id)
          const upcomingPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.negativeToId,
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
      return panelPaths.map(panelPath => {
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
    /*
        // linkColor = getRandomColor()
        return panelPaths*/
  }


  getPanelPaths(starterLink: PanelLinkModel | undefined, stringPanels: PanelModel[], stringLinks: PanelLinkModel[], positive: boolean) {
    // const starterPosLink = stringLinks.find(link => link.positiveToId === nextPanel.id)
    // const starterNegLink = stringLinks.find(link => link.negativeToId === nextPanel.id)
    // const starterLink = positive ? starterPosLink : starterNegLink
    // const examplelink = stringLinks.find(link => link.positiveToId === nextPanel.id)
    if (!starterLink) return undefined
    const nextPosPanel = stringPanels.find(panel => panel.id === starterLink.positiveToId)
    const nextNegPanel = stringPanels.find(panel => panel.id === starterLink.negativeToId)
    let nextPanel = positive ? nextPosPanel : nextNegPanel
    // if (!starterLink) return undefined
    let job = true
    let linkCounter = 0
    const linkColor: LinkColor = LinkColor.SoftGreen
    let panelCounter = 0
    const panelPaths: PanelIdPath[] = []
    // const panelPaths: PanelIdPath[] = []
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
          const secondPosPanel = stringPanels.find((panel) => panel.id === starterLink.negativeToId)
          const secondNegPanel = stringPanels.find((panel) => panel.id === starterLink.positiveToId)
          const secondPanel = positive ? secondPosPanel : secondNegPanel
          if (secondPanel) {
            nextPanel = secondPanel
          } else {
            linkCounter++
            job = false
          }
        } else {
          const upcomingPosLink = stringLinks.find((link) => link.positiveToId === nextPanel?.id)
          const upcomingNegLink = stringLinks.find((link) => link.negativeToId === nextPanel?.id)
          const upcomingLink = positive ? upcomingPosLink : upcomingNegLink
          const upcomingPosPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.negativeToId,
          )
          const upcomingNegPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.positiveToId,
          )
          const upcomingPanel = positive ? upcomingPosPanel : upcomingNegPanel
          if (upcomingLink && upcomingPanel) {
            nextPanel = upcomingPanel
          } else {
            linkCounter++
            job = false
          }
        }
        // panelCounter++
        // panelCounter = positive ? panelCounter++ : panelCounter--
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

  getValuesForPanelNeg(panel: PanelModel, stringPanels: PanelModel[], stringLinks: PanelLinkModel[]) {
    const starterLink = stringLinks.find(link => link.negativeToId === panel.id)
    if (!starterLink) return
    const linkPathMap = new Map<string, PanelPathModel>()
    let linkCounter = 0
    const linkColor: LinkColor = LinkColor.SoftGreen
    let panelCounter = 1
    let job = true

    let nextPanel: PanelModel = panel

    while (job) {
      if (nextPanel) {
        linkPathMap.set(nextPanel.id, {
          link: linkCounter,
          count: panelCounter,
          color: linkColor,
        })
        if (panelCounter === 1) {
          const secondPanel = stringPanels.find((panel) => panel.id === starterLink.positiveToId)
          if (secondPanel) {
            nextPanel = secondPanel
          } else {
            linkCounter++
            job = false
          }
        } else {
          const upcomingLink = stringLinks.find((link) => link.negativeToId === nextPanel?.id)
          const upcomingPanel = stringPanels.find(
            (panel) => panel.id === upcomingLink?.positiveToId,
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
    return linkPathMap
  }
}
