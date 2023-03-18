import { FunctionalComponent, h } from '@stencil/core'

interface HelloProps {
  name: string
}

export const Hello: FunctionalComponent<HelloProps> = ({ name }) => <h1>Hello, {name}!</h1>
