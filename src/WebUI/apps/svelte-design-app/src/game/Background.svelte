<script>
	import { renderable } from './game.js';
	export let color = null;
	
	renderable(props => {
		const { context, width, height } = props;
		context.clearRect(0, 0, width, height);
		if (color) {
			context.fillStyle = color;
			context.fillRect(0, 0, width, height);
		}
	});
</script>

<!-- The following allows this component to nest children -->
<slot></slot>