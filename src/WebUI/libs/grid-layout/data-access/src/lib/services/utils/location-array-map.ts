import { BLOCK_TYPE, BlockType, PanelModel } from '@shared/data-access/models'

export function locationArrayMap(
  type: BlockType,
  locationArray: string[],
  projectId: string,
  selectedStringId: string | undefined,
  userId: string,
) {

  switch (type) {
    case BLOCK_TYPE.PANEL: {
      return locationArray.map((location) => {
        /*        return new PanelModel({
                  projectId,
                  location,
                  stringId: selectedStringId ? selectedStringId : 'undefined',
                  rotation: 0,
                })*/
        return new PanelModel({
          projectId: projectId,
          stringId: selectedStringId ? selectedStringId : 'undefined',
          location,
          rotation: 0,
          createdById: userId,
          panelConfigId: 'undefined',
        })
      })
    }
    default:
      return undefined
  }
}
