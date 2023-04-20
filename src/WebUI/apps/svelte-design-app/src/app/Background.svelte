<script lang='ts'>
  // import { renderable } from './canvas'
  // import {}

  import { renderer } from './canvas-state'

  export let color = null

  /*  const props: () => void = () => {
   const { context, width, height } = props
   context.clearRect(0, 0, width, height)
   if (color) {
   context.fillStyle = color
   context.fillRect(0, 0, width, height)
   }
   return
   }*/

  renderer(props => {
    const { context, width, height } = props
    context.clearRect(0, 0, width, height)
    if (color) {
      context.fillStyle = color
      context.fillRect(0, 0, width, height)
    }
  })
</script>

<!-- The following allows this component to nest children -->
<slot></slot>