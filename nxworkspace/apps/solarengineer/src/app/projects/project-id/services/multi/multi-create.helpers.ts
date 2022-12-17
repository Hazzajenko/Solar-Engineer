import { BlockModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/block.model'

export interface BlocksInPathResponse {
  existingBlocks?: BlockModel[]
  locationStrings?: string[]
}

export function checkIfAnyBlocksInRoute(
  locationOne: string,
  locationTwo: string,
  blocks: BlockModel[],
): BlocksInPathResponse {
  let numberOneRow: number = 0
  let numberOneCol: number = 0

  const splitOne = locationOne.split('')
  splitOne.forEach((p, index) => {
    if (p === 'c') {
      const row = locationOne.slice(3, index)
      const col = locationOne.slice(index + 3, locationOne.length)
      numberOneRow = Number(row)
      numberOneCol = Number(col)
    }
  })
  let numberTwoRow: number = 0
  let numberTwoCol: number = 0
  const splitTwo = locationTwo.split('')
  splitTwo.forEach((p, index) => {
    if (p === 'c') {
      const row = locationTwo.slice(3, index)
      const col = locationTwo.slice(index + 3, locationTwo.length)
      numberTwoRow = Number(row)
      numberTwoCol = Number(col)
    }
  })

  if (numberOneCol === numberTwoCol) {
    let goingUp: boolean
    goingUp = numberOneRow > numberTwoRow

    const directionBlocks = goingUp ? numberOneRow - numberTwoRow : numberTwoRow - numberOneRow

    let blocksInRoute: BlockModel[] = []
    let locationStrings: string[] = []

    for (let i = 0; i < directionBlocks; i++) {
      let customIndex = i * (goingUp ? -1 : 1)
      const blockInRoute = blocks.find(
        (b) => b.location === `row${numberOneRow! + customIndex}col${numberOneCol}`,
      )!
      if (blockInRoute) {
        blocksInRoute[i] = blockInRoute
      } else {
        locationStrings[i] = `row${numberOneRow! + customIndex}col${numberOneCol}`
      }
    }
    locationStrings.push(locationOne)
    locationStrings.push(locationTwo)
    if (blocksInRoute.length > 0) {
      return {
        existingBlocks: blocksInRoute,
        locationStrings,
      }
    } else {
      return {
        existingBlocks: undefined,
        locationStrings,
      }
    }
  } else if (numberOneRow === numberTwoRow) {
    let goingLeft: boolean
    goingLeft = numberOneCol > numberTwoCol

    const directionBlocks = goingLeft ? numberOneCol - numberTwoCol : numberTwoCol - numberOneCol

    let blocksInRoute: BlockModel[] = []
    let locationStrings: string[] = []

    for (let i = 0; i < directionBlocks; i++) {
      let customIndex = i * (goingLeft ? -1 : 1)
      const blockInRoute = blocks.find(
        (b) => b.location === `row${numberOneRow}col${numberOneCol! + customIndex}`,
      )!
      if (blockInRoute) {
        blocksInRoute[i] = blockInRoute
      } else {
        locationStrings[i] = `row${numberOneRow}col${numberOneCol! + customIndex}`
      }
    }
    locationStrings.push(locationOne)
    locationStrings.push(locationTwo)
    // locationStrings.push(locationTwo)
    // locationStrings.push(locationTwo)
    if (blocksInRoute.length > 0) {
      return {
        existingBlocks: blocksInRoute,
        locationStrings,
      }
    } else {
      return {
        existingBlocks: undefined,
        locationStrings,
      }
    }
  }
  return {
    existingBlocks: undefined,
    locationStrings: undefined,
  }
}
