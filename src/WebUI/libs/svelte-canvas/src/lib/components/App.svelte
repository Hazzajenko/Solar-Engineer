<script context='module'
        lang='ts'>
  import { height, width } from './canvas-state'
  import Canvas from './Canvas.svelte'
  // import Character from './Character.svelte'
  import Text from './Text.svelte'
  import FPS from './FPS.svelte'
  import Background from './Background.svelte'
  import DotGrid from './DotGrid.svelte'
  import Panel from './panel/Panel.svelte'

  import { panels, SveltePanel } from './entity-state'
  // export { Canvas, Text, FPS, Background, height, width }
  const localPanels: SveltePanel[] = []
  /*  const panelsss = createSveltePanelArray()
   panels.set(panelsss)*/
  /*  panels.subscribe(panels => {
   console.log('panels', panels)
   localPanels.push(...panels)
   })*/

  $ : {
    // $panels
  }
  /*
   function addToPanels(event: MouseEvent, incomingPanels: SveltePanel[]) {
   // c
   console.log('incomingPanels', incomingPanels)
   const location = {
   x: event.clientX,
   y: event.clientY,
   }
   console.log('location', location)
   const panel = createSveltePanel(location)
   console.log('panel', panel)
   const updatedPanels = [...incomingPanels, { ...panel }]

   panels.set(updatedPanels)
   /!*    if (!inCart) {
   let updatedCart = [...$cart, { ...product, quantity: 1 }]

   cart.set(updatedCart)
   } else {
   alert('Item already added to Cart')
   }*!/
   }*/

</script>
<!--on:click={(e) => addToPanels(e, $panels)}
width={$width}
height={$height}-->
<Canvas>
  <Background color='hsl(0, 0%, 10%)'>
    <DotGrid divisions={30}
             color='hsla(0, 0%, 100%, 0.5)' />
  </Background>
  {#each $panels as panel}
    <!--{#each localPanels as panel}-->
    <!--    <script>console.log(panel)
        </script>-->
    <Panel x={panel.location.x}
           y={panel.location.y} />
    <!--    <script>
          console.log('panel', panel)
        </script>-->
    <!--    <li>{panel.name} x {item.qty}</li>-->
  {/each}

  <!--  <Character size={10} />-->
  <Text
    text='Click and drag around the page to move the character.'
    fontSize={12}
    align='right'
    baseline='bottom'
    x={$width - 20}
    y={$height - 20} />
  <FPS />
</Canvas>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>