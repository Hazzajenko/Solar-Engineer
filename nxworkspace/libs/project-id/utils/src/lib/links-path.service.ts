import {
  PanelModel,
  LinkColor,
  PanelLinkModel,
  PanelPathModel, PanelIdPath,
} from '@shared/data-access/models'

import { PanelsFacade, LinksFacade, StringsFacade } from '@project-id/data-access/facades'

import { inject, Injectable } from '@angular/core'
import { getRandomColor } from 'libs/grid-layout/data-access/utils/src/lib/get-random-color'
import { of } from 'rxjs'

import { combineLatestWith, map, switchMap } from 'rxjs/operators'


@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  private panelsFacade = inject(PanelsFacade)
  private linksFacade = inject(LinksFacade)
  private stringsFacade = inject(StringsFacade)

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
        let linkColor = getRandomColor()


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
          linkColor = getRandomColor()
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
    const panels = await this.panelsFacade.panelsByStringId(link.stringId)
    if (!panels) return
    const links = await this.linksFacade.linksByPanels(panels)
    if (!links) return
    const panelPathRecord = await this.stringsFacade.panelPathRecordByStringId(link.stringId)
    if (!panelPathRecord) return


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

    // const linkPathMap: PanelPathMap = new Map<PanelId, PanelPathModel>()
    const panelPaths: PanelIdPath[] = []
    let linkCounter = 0
    // let linkColor: LinkColor = LinkColor.SoftGreen
    let linkColor = getRandomColor()


    for (const starterLink of starterLinks) {
      let panelCounter = 1
      let job = true

      let nextPanel: PanelModel | undefined = panels.find(
        (panel) => panel.id === starterLink.positiveToId,
      )

      const result = Object.entries(panelPathRecord)
      type yes = typeof result
      result.find(res => res[0] === 'dsad')
      // const yo = yooo => panelPathRecord.some(({ count }) => count == yooo)
      // const checkRoleExistence = roleParam => panelPathRecord.some( ({role}) => role == roleParam)
      while (job) {
        if (nextPanel) {
          // const isNextPanelExisting = panelPathRecord[nextPanel.id]
          // if (isNextPanelExisting)
          /*          linkPathMap.set(nextPanel.id, {
                      link: linkCounter,
                      count: panelCounter,
                      color: linkColor,
                    })*/
          panelPaths.push({
            panelId: nextPanel.id,
            path: {
              link: linkCounter,
              count: panelCounter,
              color: linkColor,
            },
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
      linkColor = getRandomColor()
    }
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
    if (!selectedPanelLinks) return
    // let positiveMap: PanelPathMap

    /*    const starterPosLink = stringLinks.find(link => link.positiveToId === panel.id)
        if (starterPosLink) {
         positiveMap = this.helper(panel, starterPosLink, stringPanels, stringLinks, true)
        }*/
    // let negativeMap: PanelPathMap
    // const starterNegLink = stringLinks.find(link => link.negativeToId === panel.id)
    // const res = this.getValuesForPanel(panel, stringPanels, stringLinks)
    // const negRes = this.getValuesForPanelNeg(panel, stringPanels, stringLinks)
    /*    const result = Object.fromEntries(res)
        console.log('RESSSULT', result)
        console.log(res)*/
    console.error('fixthis')
    return undefined
    // console.log(negRes)
  }

  /*
    getValuesForPanel(panel: PanelModel, stringPanels: PanelModel[], stringLinks: PanelLinkModel[]) {
      // let skipPositive = false
      const starterPosLink = stringLinks.find(link => link.positiveToId === panel.id)
      const runPositive = !!starterPosLink

      // const linkPathMap: PanelPathMap = new Map<PanelId, PanelPathModel>()
      // const linkssPathMap: PanelPathMap = new Map<PanelId, LinkPathModel>()
      let linkCounter = 0
      const linkColor: LinkColor = LinkColor.SoftGreen
      let panelCounter = 0
      let job = true

      let nextPanel: PanelModel = panel


      if (runPositive) {
        while (job) {
          if (nextPanel) {
            linkPathMap.set(nextPanel.id, {
              link: linkCounter,
              count: panelCounter,
              color: linkColor,
            })
            if (panelCounter === 0) {
              const secondPanel = stringPanels.find((panel) => panel.id === starterPosLink.negativeToId)
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
      }
      const starterNegLink = stringLinks.find(link => link.negativeToId === panel.id)
      if (!starterNegLink) return linkPathMap
      linkCounter = 0
      job = true
      panelCounter = 0

      while (job) {
        if (nextPanel) {
          if (panelCounter !== 0) {
            linkPathMap.set(nextPanel.id, {
              link: linkCounter,
              count: panelCounter,
              color: linkColor,
            })
          }

          if (panelCounter === 0) {
            const secondPanel = stringPanels.find((panel) => panel.id === starterNegLink.positiveToId)
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
          panelCounter--
        } else {
          linkCounter++
          job = false
        }
      }
      const result = Object.fromEntries(linkPathMap)
      console.log('RESSSULT', result)
      return linkPathMap
    }

    helper(panel: PanelModel, starterLink: PanelLinkModel, stringPanels: PanelModel[], stringLinks: PanelLinkModel[], isPositiveStart: boolean) {
      const linkPathMap: PanelPathMap = new Map<PanelId, PanelPathModel>()
      // const starterLink = stringLinks.find(link => link.positiveToId === panel.id)
      let job = true
      let nextPanel = panel
      let linkCounter = 0
      const linkColor: LinkColor = LinkColor.SoftGreen
      let panelCounter = 0
      while (job) {
        if (nextPanel) {
          linkPathMap.set(nextPanel.id, {
            link: linkCounter,
            count: panelCounter,
            color: linkColor,
          })
          if (panelCounter === 0 && isPositiveStart) {
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
      const result = Object.fromEntries(linkPathMap)
      console.log('RESSSULT', result)
      // type yo = typeof result
      return linkPathMap
    }
  */

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
