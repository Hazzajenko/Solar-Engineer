import { BlockType, PanelModel } from '@shared/data-access/models'

export function locationArrayMap(
  type: BlockType,
  locationArray: string[],
  projectId: number,
  selectedStringId: string | undefined,
) {
  switch (type) {
    case BlockType.PANEL: {
      return locationArray.map((location) => {
        return new PanelModel({
          projectId,
          location,
          stringId: selectedStringId ? selectedStringId : 'undefined',
          rotation: 0,
        })
      })
    }
    default:
      return undefined
  }
}
