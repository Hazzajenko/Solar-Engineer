/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let numberRow: number = 0
  let numberCol: number = 0
  const location = data.cable.location
  const split = location.split('')
  split.forEach((p: string, index: number) => {
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

  const findTop = data.allCables.find((cable: { location: string }) => cable.location === topString)
  const findBottom = data.allCables.find(
    (cable: { location: string }) => cable.location === bottomString,
  )
  const findLeft = data.allCables.find(
    (cable: { location: string }) => cable.location === leftString,
  )
  const findRight = data.allCables.find(
    (cable: { location: string }) => cable.location === rightString,
  )

  const response = {
    left: !!findLeft,
    right: !!findRight,
    top: !!findTop,
    bottom: !!findBottom,
  }

  postMessage(response)
})
