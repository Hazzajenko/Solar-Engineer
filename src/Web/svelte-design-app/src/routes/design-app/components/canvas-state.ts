import { getContext, onMount } from 'svelte'
import { derived, writable } from 'svelte/store'

export const width = writable(window.innerWidth)
export const height = writable(window.innerHeight)
export const pixelRatio = writable(window.devicePixelRatio)

export const context = writable<CanvasRenderingContext2D>()
export const canvas = writable<HTMLCanvasElement>()
export const time = writable(0)

export const props = deriveObject({
  context,
  canvas,
  width,
  height,
  pixelRatio,
  time,
})

export const key = Symbol()

type Props = {
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  pixelRatio: number
  time: number
}

/*
 const api = {
 add: (element: any) => {
 elements.update(($elements) => {
 $elements.push(element)
 return $elements
 })
 },
 }
 */

export const getState = () => {
  const api = getContext<any>(key)
  return api.getState()
}

/*export function renderable(render: () => void) {
 const api = getContext<any>(key)
 const element = {
 ready: false,
 mounted: false,
 render,
 }
 api.add(element)
 onMount(() => {
 element.mounted = true
 return () => {
 api.remove(element)
 element.mounted = false
 }
 })
 }*/
export const renderer = (render: (props: any) => void) => {
  console.log('renderer', render)
  const api = getContext<any>(key)
  console.log('api', api)
  const element = {
    ready: false,
    mounted: false,
    render,
  }
  // if (typeof render === 'function') element.render = render
  /*  if (typeof render === 'function') element.render = render
   else if (render) {
   if (render.render) element.render = render.render
   if (render.setup) element.setup = render.setup
   }*/
  // const idk = api.getState()
  // console.log('idk', idk)
  api.add(element)
  onMount(() => {
    element.mounted = true
    return () => {
      api.remove(element)
      element.mounted = false
    }
  })
}

/*export const renderable = (render) => {
 const api = getContext(key)
 const element = {
 ready: false,
 mounted: false,
 }
 if (typeof render === 'function') element.render = render
 else if (render) {
 if (render.render) element.render = render.render
 if (render.setup) element.setup = render.setup
 }
 api.add(element)
 onMount(() => {
 element.mounted = true
 return () => {
 api.remove(element)
 element.mounted = false
 }
 })
 }*/

function deriveObject(obj: any) {
  const keys = Object.keys(obj)
  const list = keys.map((key) => {
    return obj[key]
  })
  return derived(list, (array) => {
    return array.reduce((dict: any, value, i) => {
      dict[keys[i]] = value
      return dict
    }, {})
  })
}

/*
 export const elements = writable([])
 export const elementsByType = derived(elements, ($elements) => {
 return $elements.reduce((dict, element) => {
 if (!dict[element.type]) dict[element.type] = []
 dict[element.type].push(element)
 return dict
 }, {})
 })

 export const renderables = derived(elements, ($elements) => {
 return $elements.filter((element) => element.render)
 })
 // }

 export const key = Symbol()

 export const getState = () => {
 const api = getContext(key)
 return (api as any).getState()
 }

 export const renderable = (render: { render: any; setup: any }) => {
 const api = getContext(key)
 const element = {
 ready: false,
 mounted: false,
 }
 if (typeof render === 'function') element.render = render
 else if (render) {
 if (render.render) element.render = render.render
 if (render.setup) element.setup = render.setup
 }
 api.add(element)
 onMount(() => {
 element.mounted = true
 return () => {
 api.remove(element)
 element.mounted = false
 }
 })
 }

 function deriveObject(obj: {
 [x: string]: any
 context?: Writable<unknown>
 canvas?: Writable<unknown>
 width?: Writable<number>
 height?: Writable<number>
 pixelRatio?: Writable<number>
 time?: Writable<number>
 }) {
 const keys = Object.keys(obj)
 const list = keys.map((key) => {
 return obj[key]
 })
 return derived(list, (array) => {
 return array.reduce((dict, value, i) => {
 dict[keys[i]] = value
 return dict
 }, {})
 })
 }*/