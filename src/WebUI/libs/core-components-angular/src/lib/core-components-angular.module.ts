import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DIRECTIVES } from '../generated/directives'
import { defineCustomElements } from '@undefined/core-components/loader'

defineCustomElements()

// const Directives = [...DIRECTIVES]

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class CoreComponentsAngularModule {}
