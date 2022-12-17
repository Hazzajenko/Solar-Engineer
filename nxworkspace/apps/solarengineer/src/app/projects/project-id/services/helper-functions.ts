import { SurroundingCablesModel } from '../../services/grid/grid.helpers'

export function getSurroundings(location: string, blocks: any) {
  if (!location || !blocks) {
    const surroundingCables: SurroundingCablesModel = {
      topCable: undefined,
      bottomCable: undefined,
      leftCable: undefined,
      rightCable: undefined,
    }

    return surroundingCables
  }
  let numberRow: number = 0
  let numberCol: number = 0

  const split = location.split('')
  split.forEach((p, index) => {
    if (p === 'c') {
      const row = location.slice(3, index)
      const col = location.slice(index + 3, location.length)
      numberRow = Number(row)
      numberCol = Number(col)
    }
  })
  const topString: string = `row${numberRow - 1}col${numberCol}`
  const bottomString: string = `row${numberRow + 1}col${numberCol}`
  const leftString: string = `row${numberRow}col${numberCol - 1}`
  const rightString: string = `row${numberRow}col${numberCol + 1}`

  const findTop = blocks.find((block: { location: string }) => block.location === topString)
  const findBottom = blocks.find((block: { location: string }) => block.location === bottomString)
  const findLeft = blocks.find((block: { location: string }) => block.location === leftString)
  const findRight = blocks.find((block: { location: string }) => block.location === rightString)

  const surroundingCables: SurroundingCablesModel = {
    topCable: findTop,
    bottomCable: findBottom,
    leftCable: findLeft,
    rightCable: findRight,
  }

  return surroundingCables
}
