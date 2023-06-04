import {
	type FactoryProvider,
	type Host,
	inject,
	InjectionToken,
	type InjectOptions,
	type Optional,
	type Provider,
	type Self,
	type SkipSelf,
	type Type,
} from '@angular/core'

type CreateInjectionTokenDep<TTokenType> =
	| Type<TTokenType>
	// TODO we don't have an AbstractType
	| (abstract new (...args: any[]) => TTokenType)
	| InjectionToken<TTokenType>

type CreateInjectionTokenDeps<
	TFactory extends (...args: any[]) => any,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
> = {
	[Index in keyof TFactoryDeps]:
		| CreateInjectionTokenDep<TFactoryDeps[Index]>
		| [
				...modifiers: Array<Optional | Self | SkipSelf | Host>,
				token: CreateInjectionTokenDep<TFactoryDeps[Index]>,
		  ]
} & {
	length: TFactoryDeps['length']
}

export type CreateInjectionTokenOptions<
	TFactory extends (...args: any[]) => any,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
> = (TFactoryDeps[0] extends undefined // this means TFunction has no arguments
	? {
			isRoot: boolean
			deps?: never
	  }
	: {
			isRoot?: boolean
			deps: CreateInjectionTokenDeps<TFactory, TFactoryDeps>
	  }) & {
	token?: InjectionToken<ReturnType<TFactory>>
	extraProviders?: Provider
}

type InjectFn<
	TFactory extends (...args: any[]) => any,
	TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>,
> = {
	(): TFactoryReturn
	(
		injectOptions: InjectOptions & {
			optional?: false
		},
	): TFactoryReturn
	(injectOptions: InjectOptions): TFactoryReturn | null
}

export type CreateInjectionTokenReturn<
	TFactory extends (...args: any[]) => any,
	TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>,
> = [
	InjectFn<TFactory, TFactoryReturn>,
	(value?: TFactoryReturn) => Provider,
	InjectionToken<TFactoryReturn>,
]

function createInjectFn<TValue>(token: InjectionToken<TValue>) {
	return (injectOptions?: InjectOptions) => inject(token, injectOptions as InjectOptions)
}

function createProvideFn<
	TValue,
	TFactory extends (...args: any[]) => any = (...args: any[]) => TValue,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
>(
	token: InjectionToken<TValue>,
	factory: (...args: any[]) => TValue,
	deps?: CreateInjectionTokenDeps<TFactory, TFactoryDeps>,
	extraProviders?: Provider,
) {
	return (value?: TValue) => {
		let provider: Provider
		if (value) {
			provider = {
				provide: token,
				useValue: value,
			}
		} else {
			provider = {
				provide: token,
				useFactory: factory,
				deps: (deps ?? []) as FactoryProvider['deps'],
			}
		}

		return extraProviders ? [extraProviders, provider] : provider
	}
}

export function createInjectionToken<
	TFactory extends (...args: any[]) => any,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
	TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>,
>(
	factory: TFactory,
	options?: CreateInjectionTokenOptions<TFactory, TFactoryDeps>,
): CreateInjectionTokenReturn<TFactory, TFactoryReturn> {
	const opts = options ?? ({ isRoot: true } as CreateInjectionTokenOptions<TFactory, TFactoryDeps>)

	opts.isRoot ??= true

	if (opts.isRoot) {
		const token = new InjectionToken<TFactoryReturn>(`Token for ${factory.name}`, {
			factory: () => {
				if (opts.deps && Array.isArray(opts.deps)) {
					return factory(...opts.deps.map((dep) => inject(dep)))
				}
				return factory()
			},
		})

		return [
			createInjectFn(token) as CreateInjectionTokenReturn<TFactory, TFactoryReturn>[0],
			createProvideFn(token, factory, opts.deps as any[]),
			token,
		]
	}

	const token = opts.token || new InjectionToken<TFactoryReturn>(`Token for ${factory.name}`)
	return [
		createInjectFn(token) as CreateInjectionTokenReturn<TFactory, TFactoryReturn>[0],
		createProvideFn(token, factory, opts.deps as any[], opts.extraProviders),
		token,
	]
}

export type CreateServiceInjectorOptions<
	TFactory extends (...args: any[]) => any,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
> = {
	deps: CreateInjectionTokenDeps<TFactory, TFactoryDeps>
}

export function createRootServiceInjector<
	TFactory extends (...args: any[]) => any,
	TFactoryDeps extends Parameters<TFactory> = Parameters<TFactory>,
	TFactoryReturn extends ReturnType<TFactory> = ReturnType<TFactory>,
>(factory: TFactory, options: CreateServiceInjectorOptions<TFactory, TFactoryDeps>) {
	const opts = options

	const token = new InjectionToken<TFactoryReturn>(`Token for ${factory.name}`, {
		factory: () => {
			if (opts.deps && Array.isArray(opts.deps)) {
				return factory(...opts.deps.map((dep) => inject(dep)))
			}
			return factory()
		},
	})

	return createInjectFn(token) as CreateInjectionTokenReturn<TFactory, TFactoryReturn>[0]
}
