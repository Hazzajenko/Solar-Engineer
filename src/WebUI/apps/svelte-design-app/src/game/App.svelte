<script>
	import { width, height } from './game.js';

	import Canvas from './Canvas.svelte';
	import Background from './Background.svelte';
	import DotGrid from './DotGrid.svelte';
	import Character from './Character.svelte';
	import Text from './Text.svelte';
	import FPS from './FPS.svelte';
</script>

<Canvas>
	<Background color='hsl(0, 0%, 10%)'>
		<DotGrid divisions={30} color='hsla(0, 0%, 100%, 0.5)' />
	</Background>
	<Character size={10} />
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