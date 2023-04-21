<script lang='ts'>
  import { renderer } from '../canvas-state'
  import { getContext, onMount } from 'svelte'
  // import {listeners }
  // import Text from './Text.svelte'
  // context.
  export let color = '#ffe554'
  export let size = 10
  /*  export let thickness = 3

   export let startX = $width / 2
   export let startY = $height / 2
   export let moveSpeed = 0.2
   export let maxVelocity = 5*/

  let text

  // let x = startX
  // let y = startY
  /*  export let x = startX
   export let y = startY*/
  /*  export let x = 0
   export let y = 0*/
  export let x
  export let y
  let location = {
    x,
    y,
  }
  const height = 32
  const width = 32
  const angle = 0
  const velocity = [0, 0]

  let mouse = null
  let pointer
  let mouseDown = false

  const { getCanvas } = getContext('canvas')

  const canvas = getCanvas()

  onMount(() => {
    const canvas: HTMLCanvasElement = getCanvas()
    const ctx = canvas.getContext('2d')
    console.log('ctx', ctx)
    if (!ctx) return

    ctx.save()
    ctx.fillStyle = color
    ctx.translate(location.x + width / 2, location.y + height / 2)
    ctx.rotate(angle)
    ctx.beginPath()
    ctx.rect(-width / 2, -height / 2, width, height)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    /*    ctx.beginPath()
     ctx.fillStyle = color
     ctx.arc(x, y, radius, startAngle, endAngle)
     ctx.fill()*/
  })

  renderer(props => {
    console.log('x, y', x, y)
    const { context } = props
    console.log('context', context)
    // console.log('context', context)
    // console.log('x', x)
    // console.log('y', y)

    let position = [x, y]
    console.log('position', position)

    // context.lineCap = 'round'

    context.save()
    context.fillStyle = color
    context.translate(location.x + width / 2, location.y + height / 2)
    context.rotate(angle)
    context.beginPath()
    context.rect(-width / 2, -height / 2, width, height)
    context.fill()
    context.stroke()
    context.restore()

    /*    context.beginPath()
     context.fillStyle = color
     context.strokeStyle = color
     context.lineWidth = thickness*/
    // context.arc(x, y, size, 0, Math.PI * 2)
    context.rect(x, y, 100, 100)
    // context.rect(x, y, size, size)
    context.stroke()
  })

</script>

<!--<svelte:window
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mousemove={handleMouseMove} />-->

<!--<Text
  fontSize={8}
  baseline='top'
  bind:this={text}
/>-->

<!-- The following allows this component to nest children -->
<slot></slot>