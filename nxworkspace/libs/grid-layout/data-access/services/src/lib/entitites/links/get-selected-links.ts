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
  const positive = panelJoins.find((pJoin) => pJoin.negativeToId === selectedPanelId)?.positiveToId
  const negative = panelJoins.find((pJoin) => pJoin.positiveToId === selectedPanelId)?.negativeToId
  return {
    selectedPositiveLinkTo: positive,
    selectedNegativeLinkTo: negative,
  } as PanelLinksToModel
}