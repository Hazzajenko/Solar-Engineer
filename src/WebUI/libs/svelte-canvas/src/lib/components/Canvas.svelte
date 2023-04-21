<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';

  import {
    key,
    width,
    height,
    canvas as canvasStore,
    context as contextStore,
    pixelRatio,
    props,
    time, renderer,
  } from './canvas-state'

  import { createSveltePanel, createSveltePanelArray, panels, SveltePanel } from './entity-state'


	export let killLoopOnError = true;
	export let attributes = {};

	let listeners = [];
	let canvas;
	let context;
	let frame;

	onMount(() => {
		// prepare canvasState stores
		context = canvas.getContext('2d', attributes);
    console.log('context', context)
		canvasStore.set(canvas);
		contextStore.set(context);

/*    const panelArr = [
      {
        render: (props, dt) => {
          console.log('render', props, dt)
          context.fillStyle = 'red'
          context.fillRect(0, 0, 100, 100)
        }
      },
      {
        render: (props, dt) => {
          console.log('render', props, dt)
          context.fillStyle = 'blue'
          context.fillRect(100, 100, 100, 100)
        }
      }


    ]
    const panelsss = createSveltePanelArray()
    panels.set(panelsss)*/

/*    const panelfucks: CanvasEntity[] = [
      createPanel({x: 100, y: 500}),
      createPanel({x: 300, y: 500}),
      createPanel({x: 500, y: 500}),
      createPanel({x: 800, y: 500}),
    ]

    panels.set(panelfucks)*/

/*    panels.subscribe((panels) => {
      console.log('panels', panels)
      panels.forEach(panel => {
        // listeners.push(panel)
      })
    })*/
  /*  // add panels
    panels.forEach(panel => {
      listeners.push(panel)
    })*/

		// setup entities
		listeners.forEach(async entity => {
			if (entity.setup) {
				let p = entity.setup($props);
				if (p && p.then) await p;
			}
			entity.ready = true;
		});

    console.log('listeners', listeners)

		// start game loop
		return createLoop((elapsed, dt) => {
			time.set(elapsed);
			render(dt);
		});
	});

  setContext('canvas', {
    getCanvas: () => canvas,
  })

	setContext(key, {
		add (fn) {
			this.remove(fn);
			listeners.push(fn);
		},
		remove (fn) {
			const idx = listeners.indexOf(fn);
			if (idx >= 0) listeners.splice(idx, 1);
		}
	});

	function render (dt) {
		context.save();
		context.scale($pixelRatio, $pixelRatio);
		listeners.forEach(entity => {
			try {
				if (entity.mounted && entity.ready && entity.render) {
					entity.render($props, dt);
				}
			} catch (err) {
				console.error(err);
				if (killLoopOnError) {
					cancelAnimationFrame(frame);
					console.warn('Animation loop stopped due to an error');
				}
			}
		});
		context.restore();
	}

	function handleResize () {
		width.set(window.innerWidth);
		height.set(window.innerHeight);
		pixelRatio.set(window.devicePixelRatio);
	}

	function createLoop (fn) {
		let elapsed = 0;
		let lastTime = performance.now();
		(function loop() {
			frame = requestAnimationFrame(loop);
			const beginTime = performance.now();
			const dt = (beginTime - lastTime) / 1000;
			lastTime = beginTime;
			elapsed += dt;
			fn(elapsed, dt);
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}

  function addPanel(e: MouseEvent) {
    // console.log('addPanel', panel)
    const svPanel = {
      render: (props, dt) => {
        console.log('render', props, dt)
        context.fillStyle = 'red'
        context.fillRect(0, 0, 100, 100)
      }
    }

    const location = {
      x: e.clientX,
      y: e.clientY
    }
    const fuck = createSveltePanel(location)
    panels.set([fuck])
    // listeners.push(panel)
  }

  function handleMouseDown(e: MouseEvent) {
    console.log('mousedown', e)
    addPanel(e)
/*    addPanel({
      render: (props, dt) => {
        console.log('render', props, dt)
        context.fillStyle = 'red'
        context.fillRect(0, 0, 100, 100)
      }
    })*/
/*    renderer(props => {
      const { context, width, height } = props
      context.clearRect(0, 0, width, height)
      context.fillRect(123, 433, width, height)
      // if (color) {
      //   context.fillStyle = color
      //   context.fillRect(0, 0, width, height)
      // }
    })*/

  }

  function handleMouseUp(e) {
    console.log('mouseup', e)
  }

  function handleMouseMove(e) {
    // console.log('mousemove', e)
  }


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
    /*    if (!inCart) {
     let updatedCart = [...$cart, { ...product, quantity: 1 }]

     cart.set(updatedCart)
     } else {
     alert('Item already added to Cart')
     }*/
  }
</script>

<canvas
	bind:this={canvas}
	width={$width * $pixelRatio}
	height={$height * $pixelRatio}
	style="width: {$width}px; height: {$height}px;"></canvas>
<svelte:window
  on:resize|passive={handleResize}
  on:click={(e) => addToPanels(e, $panels)}

/>
<!--on:mousedown={handleMouseDown}-->
<!--on:mouseup={handleMouseUp}-->
<!--on:mousemove={handleMouseMove}-->
<!--<svelte:windows
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mousemove={handleMouseMove} />-->
<slot></slot>

