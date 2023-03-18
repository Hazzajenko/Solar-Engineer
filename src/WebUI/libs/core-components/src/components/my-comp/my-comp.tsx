import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'my-comp',
  styleUrl: 'my-comp.scss',
  shadow: true,
})
export class MyComp {
  /**
   * The first name
   */
  @Prop() first!: string

  /**
   * The middle name
   */
  @Prop() middle!: string

  /**
   * The last name
   */
  @Prop() last!: string

  private getText(): string {
    return (
      (this.first || '') +
      (this.middle ? ` ${this.middle}` : '') +
      (this.last ? ` ${this.last}` : '')
    )
  }

  render() {
    return <div>Hello, World! I'm {this.getText()}</div>
  }
}
