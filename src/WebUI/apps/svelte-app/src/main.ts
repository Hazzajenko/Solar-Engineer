import App from './App.svelte'

const app = new App({
  target: document.body,
  props: {
    name: 'svelte-app',
  },
})

export default app
