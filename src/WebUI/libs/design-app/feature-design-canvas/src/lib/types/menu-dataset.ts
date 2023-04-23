export type MenuDataset = {
  id: string
  type: string
  angle: string
  stringId?: string
}

export const menuDataset = (
  id: string,
  type: string,
  angle: string,
  stringId?: string,
): MenuDataset => ({
  id,
  type,
  angle,
  stringId,
})

export const domStringMapToMenuDataSet = (obj: DOMStringMap): MenuDataset => {
  if (!obj || !obj['id'] || !obj['type'] || !obj['angle']) {
    // throw new Error('Invalid DOMStringMap')
    return menuDataset('', '', '')
  }
  return menuDataset(obj['id'], obj['type'], obj['angle'], obj['stringId'])
}

export const domStringMapToPanelMenuDataSet = (obj: DOMStringMap): MenuDataset => {
  if (!obj || !obj['id'] || !obj['type'] || !obj['angle'] || !obj['stringId']) {
    throw new Error('Invalid DOMStringMap')
  }
  return menuDataset(obj['id'], obj['type'], obj['angle'], obj['stringId'])
}
