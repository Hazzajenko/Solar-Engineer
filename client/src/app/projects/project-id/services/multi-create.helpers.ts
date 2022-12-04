import { BlockModel } from '../../models/block.model'
import { NumberLocation } from './strings.deconstruct'

export interface BlocksInPathResponse {
  existingBlocks?: BlockModel[]
  locationStrings?: string[]
}

export function checkIfAnyBlocksInPath(
  locationOne: NumberLocation,
  locationTwo: NumberLocation,
  blocks: BlockModel[],
) {
  let numberOneCol = locationOne.numberCol
  let numberOneRow = locationOne.numberRow
  let numberTwoCol = locationOne.numberCol
  let numberTwoRow = locationOne.numberRow

  if (numberOneCol && numberTwoCol && numberOneRow && numberTwoRow) {
    if (numberOneCol === numberTwoCol) {
      console.log('Y AXIS')
      let goingUp: boolean
      if (numberOneRow > numberTwoRow) {
        console.log('going up')
        goingUp = true
      } else {
        console.log('going down')
        goingUp = false
      }

      const directionBlocks = goingUp ? numberOneRow - numberTwoRow : numberTwoRow - numberOneRow

      let blocksInRoute: BlockModel[] = []
      let locationStrings: string[] = []

      for (let i = 0; i < directionBlocks; i++) {
        let directionNumber = goingUp ? -1 : 1
        let customIndex = i * (goingUp ? -1 : 1)

        // locationStrings[i] = `row${numberOneRow! + customIndex + directionNumber}col${numberOneCol}`
        // console.log(locationStrings)
        const locationString = `row${
          numberOneRow! + customIndex + directionNumber
        }col${numberOneCol}`
        const blockInRoute = blocks.find(
          (b) =>
            b.location === `row${numberOneRow! + customIndex + directionNumber}col${numberOneCol}`,
        )!
        if (blockInRoute) {
          console.log(blocksInRoute)
          blocksInRoute[i] = blockInRoute
        } else {
          locationStrings[i] = locationString
        }
        locationStrings[i] = locationString
        console.log(locationStrings)
      }

      if (blocksInRoute.length > 0) {
        return blocksInRoute
        /*        return {
                  existingBlocks: blocksInRoute,
                  locationStrings,
                } as BlocksInPathResponse*/
      } else {
        /*        return {
                  existingBlocks: undefined,
                  locationStrings,
                } as BlocksInPathResponse*/
      }
    } else if (numberOneRow === numberTwoRow) {
      console.log('X AXIS')
      let goingLeft: boolean
      if (numberOneCol > numberTwoCol) {
        console.log('going left')
        goingLeft = true
      } else {
        console.log('going right')
        goingLeft = false
      }

      const directionBlocks = goingLeft ? numberOneCol - numberTwoCol : numberTwoRow - numberOneCol

      let blocksInRoute: BlockModel[] = []
      let locationStrings: string[] = []

      for (let i = 0; i < directionBlocks; i++) {
        let directionNumber = goingLeft ? -1 : 1
        let customIndex = i * (goingLeft ? -1 : 1)

        const locationString = `row${numberOneRow}col${
          numberOneCol! + customIndex + directionNumber
        }`
        const blockInRoute = blocks.find((b) => b.location === locationString)!
        if (blockInRoute) {
          blocksInRoute[i] = blockInRoute
        } else {
          // locationStrings[i] = locationString
          locationStrings.push(locationString)
        }
      }
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
  }
  return {
    existingBlocks: undefined,
    locationStrings: undefined,
  }
}

export function checkIfAnyBlocksInRoute(
  locationOne: string,
  locationTwo: string,
  blocks: BlockModel[],
): BlocksInPathResponse {
  let numberOneRow: number | undefined = undefined
  let numberOneCol: number | undefined = undefined

  const splitOne = locationOne.split('')
  splitOne.forEach((p, index) => {
    if (p === 'c') {
      const row = locationOne.slice(3, index)
      const col = locationOne.slice(index + 3, locationOne.length)
      numberOneRow = Number(row)
      numberOneCol = Number(col)
    }
  })
  let numberTwoRow: number | undefined = undefined
  let numberTwoCol: number | undefined = undefined
  const splitTwo = locationTwo.split('')
  splitTwo.forEach((p, index) => {
    if (p === 'c') {
      const row = locationTwo.slice(3, index)
      const col = locationTwo.slice(index + 3, locationTwo.length)
      numberTwoRow = Number(row)
      numberTwoCol = Number(col)
    }
  })
  if (numberOneCol && numberTwoCol && numberOneRow && numberTwoRow) {
    if (numberOneCol === numberTwoCol) {
      console.log('Y AXIS')
      let goingUp: boolean
      if (numberOneRow > numberTwoRow) {
        console.log('going up')
        goingUp = true
      } else {
        console.log('going down')
        goingUp = false
      }

      const directionBlocks = goingUp ? numberOneRow - numberTwoRow : numberTwoRow - numberOneRow

      let blocksInRoute: BlockModel[] = []
      let locationStrings: string[] = []

      for (let i = 0; i < directionBlocks; i++) {
        let directionNumber = goingUp ? -1 : 1
        let customIndex = i * (goingUp ? -1 : 1)
        const blockInRoute = blocks.find(
          (b) =>
            b.location === `row${numberOneRow! + customIndex + directionNumber}col${numberOneCol}`,
        )!
        if (blockInRoute) {
          blocksInRoute[i] = blockInRoute
        } else {
          locationStrings[i] = `row${
            numberOneRow! + customIndex + directionNumber
          }col${numberOneCol}`
        }
      }
      if (blocksInRoute.length > 0) {
        // return blocksInRoute
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
      console.log('X AXIS')
      let goingLeft: boolean
      if (numberOneCol > numberTwoCol) {
        console.log('going left')
        goingLeft = true
      } else {
        console.log('going right')
        goingLeft = false
      }

      const directionBlocks = goingLeft ? numberOneCol - numberTwoCol : numberTwoRow - numberOneCol

      let blocksInRoute: BlockModel[] = []
      let locationStrings: string[] = []

      for (let i = 0; i < directionBlocks; i++) {
        let directionNumber = goingLeft ? -1 : 1
        let customIndex = i * (goingLeft ? -1 : 1)
        const blockInRoute = blocks.find(
          (b) =>
            b.location === `row${numberOneRow}col${numberOneCol! + customIndex + directionNumber}`,
        )!
        if (blockInRoute) {
          blocksInRoute[i] = blockInRoute
        } else {
          locationStrings[i] = `row${numberOneRow}col${
            numberOneCol! + customIndex + directionNumber
          }`
        }
      }
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
  }
  return {
    existingBlocks: undefined,
    locationStrings: undefined,
  }
}
