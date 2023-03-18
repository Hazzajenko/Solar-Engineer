import { Config } from '@stencil/core'

import { sass } from '@stencil/sass'
import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target'

const angularValueAccessorBindings: ValueAccessorConfig[] = []

export const config: Config = {
  namespace: 'core-components',
  taskQueue: 'async',
  sourceMap: true,

  extras: {
    experimentalImportInjection: true,
  },
  plugins: [sass()],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/hydrate',
    },
    {
      type: 'dist-custom-elements',
      autoDefineCustomElements: true,
      includeGlobalScripts: false,
    },

    angularOutputTarget({
      // componentCorePackage: '@core-components',
      componentCorePackage: '@undefined/core-components',
      // componentCorePackage: 'my-comp',
      directivesProxyFile:
        '../../../libs/core-components-angular/src/generated/directives/proxies.ts',
      directivesArrayFile:
        '../../../libs/core-components-angular/src/generated/directives/index.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
      // includeImportCustomElements: true,
    }),
  ],
}
