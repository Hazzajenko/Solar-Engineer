// import App from '@svelte-canvas/App.svelte'
import { App } from '@svelte-canvas';


// import App from './app/App.svelte'

// import App from './app/App.svelte'

const app = new App({
  target: document.body,
  props: {
    name: 'svelte-design-app',
  },
})
export default app