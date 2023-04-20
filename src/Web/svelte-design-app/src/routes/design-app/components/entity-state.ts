import { getContext } from 'svelte'
import { writable } from 'svelte/store'

export type SveltePoint = {
  x: number
  y: number
}
export type SveltePanel = {
  id: string
  location: SveltePoint
}

export const createSveltePanel = (location: SveltePoint): SveltePanel => {
  return {
    id: randomId(),
    location,
  }
}

export const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const createSveltePanelArray = (): SveltePanel[] => {
  return [
    {
      id: randomId(),
      location: { x: randomNumberBetween(5, 1000), y: randomNumberBetween(5, 1000) },
    },
    {
      id: randomId(),
      location: { x: randomNumberBetween(5, 1000), y: randomNumberBetween(5, 1000) },
    },
    {
      id: randomId(),
      location: { x: randomNumberBetween(5, 1000), y: randomNumberBetween(5, 1000) },
    },
    {
      id: randomId(),
      location: { x: randomNumberBetween(5, 1000), y: randomNumberBetween(5, 1000) },
    },
    {
      id: randomId(),
      location: { x: randomNumberBetween(5, 1000), y: randomNumberBetween(5, 1000) },
    },
  ]
}
export const panels = writable<SveltePanel[]>([])
export const selectedPanel = writable<SveltePanel | null>(null)

export const key = Symbol()

export const getState = () => {
  const api = getContext<any>(key)
  return api.getState()
}

/*export const setState = (state: any) => {
 const api = getContext<any>(key)
 api.setState(state)
 }*/

export const addPanel = (panel: SveltePanel) => {
  const api = getContext<any>(key)
  api.add(panel)
}

export const removePanel = (panel: SveltePanel) => {
  const api = getContext<any>(key)
  api.remove(panel)
}

export const getPanel = (id: string) => {
  const api = getContext<any>(key)
  return api.get(id)
}