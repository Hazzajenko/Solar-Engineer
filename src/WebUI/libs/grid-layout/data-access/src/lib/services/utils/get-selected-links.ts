import { PanelLinkModel, PanelLinksToModel } from '@shared/data-access/models'

export function getSelectedLinks(
  panelJoins?: PanelLinkModel[],
  selectedPanelId?: string,
): PanelLinksToModel {
  if (!panelJoins || !selectedPanelId) {
    return {
      selectedPositiveLinkTo: undefined,
      selectedNegativeLinkTo: undefined,
    } as PanelLinksToModel
  }
  const positive = panelJoins.find(
    (pJoin) => pJoin.panelNegativeToId === selectedPanelId,
  )?.panelPositiveToId
  const negative = panelJoins.find(
    (pJoin) => pJoin.panelPositiveToId === selectedPanelId,
  )?.panelNegativeToId
  return {
    selectedPositiveLinkTo: positive,
    selectedNegativeLinkTo: negative,
  } as PanelLinksToModel
}
