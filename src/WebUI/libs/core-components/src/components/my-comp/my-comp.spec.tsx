import { newSpecPage } from '@stencil/core/testing'
import { MyComp } from './my-comp'

describe('my-comp', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComp],
      html: '<my-comp></my-comp>',
    })
    expect(root).toEqualHtml(`
      <my-comp>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </my-comp>
    `)
  })

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComp],
      html: `<my-comp first="Stencil" last="'Don't call me a framework' JS"></my-comp>`,
    })
    expect(root).toEqualHtml(`
      <my-comp first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </my-comp>
    `)
  })
})
