/*
// http://github.com/dvkndn/typed-tailwind
import { TailwindClass } from './tailwind-data'

export const Tw = (): Tailwind => new Tailwind()

export type NgTailwind = Record<TailwindClass, boolean>

const ngTailwind: NgTailwind = {
	block: true,
}

const TAILWIND_CLASS = {
	BLOCK: 'block',
	INLINE_BLOCK: 'inline-block',
}

// export type TailwindClass = string

class Tailwind {
	value: TailwindClass = ''

	// Getter methods
	// Why "$":
	// - https://github.com/microsoft/TypeScript/issues/2361
	// - https://github.com/microsoft/TypeScript/issues/4538
	// - https://en.wikipedia.org/wiki/Regular_expression
	$(): TailwindClass {
		return this.value
	}

	[Symbol.toPrimitive](): TailwindClass {
		return this.$()
	}

	// Styling methods
	twBlock(): Tailwind {
		return this.add('block')
	}

	twInlineBlock(): Tailwind {
		return this.add('inline-block')
	}

	twInline(): Tailwind {
		return this.add('inline')
	}

	twFlex(): Tailwind {
		return this.add('flex')
	}

	twInlineFlex(): Tailwind {
		return this.add('inline-flex')
	}

	twTable(): Tailwind {
		return this.add('table')
	}

	twTableRow(): Tailwind {
		return this.add('table-row')
	}

	twTableCell(): Tailwind {
		return this.add('table-cell')
	}

	twHidden(): Tailwind {
		return this.add('hidden')
	}

	twStatic(): Tailwind {
		return this.add('static')
	}

	twFixed(): Tailwind {
		return this.add('fixed')
	}

	twAbsolute(): Tailwind {
		return this.add('absolute')
	}

	twRelative(): Tailwind {
		return this.add('relative')
	}

	twSticky(): Tailwind {
		return this.add('sticky')
	}

	twTextBlack(): Tailwind {
		return this.add('text-black')
	}

	twTextWhite(): Tailwind {
		return this.add('text-white')
	}

	twTextGrayLight(): Tailwind {
		return this.add('text-gray-light')
	}

	twTextGrayMid(): Tailwind {
		return this.add('text-gray-mid')
	}

	twTextGrayDark(): Tailwind {
		return this.add('text-gray-dark')
	}

	twTextRedLight(): Tailwind {
		return this.add('text-red-light')
	}

	twTextRedMid(): Tailwind {
		return this.add('text-red-mid')
	}

	twTextRedDark(): Tailwind {
		return this.add('text-red-dark')
	}

	twTextBlueLight(): Tailwind {
		return this.add('text-blue-light')
	}

	twTextBlueMid(): Tailwind {
		return this.add('text-blue-mid')
	}

	twTextBlueDark(): Tailwind {
		return this.add('text-blue-dark')
	}

	twBgBlack(): Tailwind {
		return this.add('bg-black')
	}

	twBgWhite(): Tailwind {
		return this.add('bg-white')
	}

	twBgGrayLight(): Tailwind {
		return this.add('bg-gray-light')
	}

	twBgGrayMid(): Tailwind {
		return this.add('bg-gray-mid')
	}

	twBgGrayDark(): Tailwind {
		return this.add('bg-gray-dark')
	}

	twBgRedLight(): Tailwind {
		return this.add('bg-red-light')
	}

	twBgRedMid(): Tailwind {
		return this.add('bg-red-mid')
	}

	twBgRedDark(): Tailwind {
		return this.add('bg-red-dark')
	}

	twBgBlueLight(): Tailwind {
		return this.add('bg-blue-light')
	}

	twBgBlueMid(): Tailwind {
		return this.add('bg-blue-mid')
	}

	twBgBlueDark(): Tailwind {
		return this.add('bg-blue-dark')
	}

	twM4(): Tailwind {
		return this.add('m-4')
	}

	twM8(): Tailwind {
		return this.add('m-8')
	}

	twM16(): Tailwind {
		return this.add('m-16')
	}

	twM24(): Tailwind {
		return this.add('m-24')
	}

	twM1(): Tailwind {
		return this.add('-m-1')
	}

	twMy4(): Tailwind {
		return this.add('my-4')
	}

	twMx4(): Tailwind {
		return this.add('mx-4')
	}

	twMy8(): Tailwind {
		return this.add('my-8')
	}

	twMx8(): Tailwind {
		return this.add('mx-8')
	}

	twMy16(): Tailwind {
		return this.add('my-16')
	}

	twMx16(): Tailwind {
		return this.add('mx-16')
	}

	twMy24(): Tailwind {
		return this.add('my-24')
	}

	twMx24(): Tailwind {
		return this.add('mx-24')
	}

	twMy1(): Tailwind {
		return this.add('-my-1')
	}

	twMx1(): Tailwind {
		return this.add('-mx-1')
	}

	twMt4(): Tailwind {
		return this.add('mt-4')
	}

	twMr4(): Tailwind {
		return this.add('mr-4')
	}

	twMb4(): Tailwind {
		return this.add('mb-4')
	}

	twMl4(): Tailwind {
		return this.add('ml-4')
	}

	twMt8(): Tailwind {
		return this.add('mt-8')
	}

	twMr8(): Tailwind {
		return this.add('mr-8')
	}

	twMb8(): Tailwind {
		return this.add('mb-8')
	}

	twMl8(): Tailwind {
		return this.add('ml-8')
	}

	twMt16(): Tailwind {
		return this.add('mt-16')
	}

	twMr16(): Tailwind {
		return this.add('mr-16')
	}

	twMb16(): Tailwind {
		return this.add('mb-16')
	}

	twMl16(): Tailwind {
		return this.add('ml-16')
	}

	twMt24(): Tailwind {
		return this.add('mt-24')
	}

	twMr24(): Tailwind {
		return this.add('mr-24')
	}

	twMb24(): Tailwind {
		return this.add('mb-24')
	}

	twMl24(): Tailwind {
		return this.add('ml-24')
	}

	twMt1(): Tailwind {
		return this.add('-mt-1')
	}

	twMr1(): Tailwind {
		return this.add('-mr-1')
	}

	twMb1(): Tailwind {
		return this.add('-mb-1')
	}

	twMl1(): Tailwind {
		return this.add('-ml-1')
	}

	twP4(): Tailwind {
		return this.add('p-4')
	}

	twP8(): Tailwind {
		return this.add('p-8')
	}

	twP16(): Tailwind {
		return this.add('p-16')
	}

	twP24(): Tailwind {
		return this.add('p-24')
	}

	twPy4(): Tailwind {
		return this.add('py-4')
	}

	twPx4(): Tailwind {
		return this.add('px-4')
	}

	twPy8(): Tailwind {
		return this.add('py-8')
	}

	twPx8(): Tailwind {
		return this.add('px-8')
	}

	twPy16(): Tailwind {
		return this.add('py-16')
	}

	twPx16(): Tailwind {
		return this.add('px-16')
	}

	twPy24(): Tailwind {
		return this.add('py-24')
	}

	twPx24(): Tailwind {
		return this.add('px-24')
	}

	twPt4(): Tailwind {
		return this.add('pt-4')
	}

	twPr4(): Tailwind {
		return this.add('pr-4')
	}

	twPb4(): Tailwind {
		return this.add('pb-4')
	}

	twPl4(): Tailwind {
		return this.add('pl-4')
	}

	twPt8(): Tailwind {
		return this.add('pt-8')
	}

	twPr8(): Tailwind {
		return this.add('pr-8')
	}

	twPb8(): Tailwind {
		return this.add('pb-8')
	}

	twPl8(): Tailwind {
		return this.add('pl-8')
	}

	twPt16(): Tailwind {
		return this.add('pt-16')
	}

	twPr16(): Tailwind {
		return this.add('pr-16')
	}

	twPb16(): Tailwind {
		return this.add('pb-16')
	}

	twPl16(): Tailwind {
		return this.add('pl-16')
	}

	twPt24(): Tailwind {
		return this.add('pt-24')
	}

	twPr24(): Tailwind {
		return this.add('pr-24')
	}

	twPb24(): Tailwind {
		return this.add('pb-24')
	}

	twPl24(): Tailwind {
		return this.add('pl-24')
	}

	twText14(): Tailwind {
		return this.add('text-14')
	}

	twText16(): Tailwind {
		return this.add('text-16')
	}

	twText18(): Tailwind {
		return this.add('text-18')
	}

	smTwBlock(): Tailwind {
		return this.add('sm:block')
	}

	smTwInlineBlock(): Tailwind {
		return this.add('sm:inline-block')
	}

	smTwInline(): Tailwind {
		return this.add('sm:inline')
	}

	smTwFlex(): Tailwind {
		return this.add('sm:flex')
	}

	smTwInlineFlex(): Tailwind {
		return this.add('sm:inline-flex')
	}

	smTwTable(): Tailwind {
		return this.add('sm:table')
	}

	smTwTableRow(): Tailwind {
		return this.add('sm:table-row')
	}

	smTwTableCell(): Tailwind {
		return this.add('sm:table-cell')
	}

	smTwHidden(): Tailwind {
		return this.add('sm:hidden')
	}

	smTwStatic(): Tailwind {
		return this.add('sm:static')
	}

	smTwFixed(): Tailwind {
		return this.add('sm:fixed')
	}

	smTwAbsolute(): Tailwind {
		return this.add('sm:absolute')
	}

	smTwRelative(): Tailwind {
		return this.add('sm:relative')
	}

	smTwSticky(): Tailwind {
		return this.add('sm:sticky')
	}

	smTwM4(): Tailwind {
		return this.add('sm:m-4')
	}

	smTwM8(): Tailwind {
		return this.add('sm:m-8')
	}

	smTwM16(): Tailwind {
		return this.add('sm:m-16')
	}

	smTwM24(): Tailwind {
		return this.add('sm:m-24')
	}

	smTwM1(): Tailwind {
		return this.add('sm:-m-1')
	}

	smTwMy4(): Tailwind {
		return this.add('sm:my-4')
	}

	smTwMx4(): Tailwind {
		return this.add('sm:mx-4')
	}

	smTwMy8(): Tailwind {
		return this.add('sm:my-8')
	}

	smTwMx8(): Tailwind {
		return this.add('sm:mx-8')
	}

	smTwMy16(): Tailwind {
		return this.add('sm:my-16')
	}

	smTwMx16(): Tailwind {
		return this.add('sm:mx-16')
	}

	smTwMy24(): Tailwind {
		return this.add('sm:my-24')
	}

	smTwMx24(): Tailwind {
		return this.add('sm:mx-24')
	}

	smTwMy1(): Tailwind {
		return this.add('sm:-my-1')
	}

	smTwMx1(): Tailwind {
		return this.add('sm:-mx-1')
	}

	smTwMt4(): Tailwind {
		return this.add('sm:mt-4')
	}

	smTwMr4(): Tailwind {
		return this.add('sm:mr-4')
	}

	smTwMb4(): Tailwind {
		return this.add('sm:mb-4')
	}

	smTwMl4(): Tailwind {
		return this.add('sm:ml-4')
	}

	smTwMt8(): Tailwind {
		return this.add('sm:mt-8')
	}

	smTwMr8(): Tailwind {
		return this.add('sm:mr-8')
	}

	smTwMb8(): Tailwind {
		return this.add('sm:mb-8')
	}

	smTwMl8(): Tailwind {
		return this.add('sm:ml-8')
	}

	smTwMt16(): Tailwind {
		return this.add('sm:mt-16')
	}

	smTwMr16(): Tailwind {
		return this.add('sm:mr-16')
	}

	smTwMb16(): Tailwind {
		return this.add('sm:mb-16')
	}

	smTwMl16(): Tailwind {
		return this.add('sm:ml-16')
	}

	smTwMt24(): Tailwind {
		return this.add('sm:mt-24')
	}

	smTwMr24(): Tailwind {
		return this.add('sm:mr-24')
	}

	smTwMb24(): Tailwind {
		return this.add('sm:mb-24')
	}

	smTwMl24(): Tailwind {
		return this.add('sm:ml-24')
	}

	smTwMt1(): Tailwind {
		return this.add('sm:-mt-1')
	}

	smTwMr1(): Tailwind {
		return this.add('sm:-mr-1')
	}

	smTwMb1(): Tailwind {
		return this.add('sm:-mb-1')
	}

	smTwMl1(): Tailwind {
		return this.add('sm:-ml-1')
	}

	smTwP4(): Tailwind {
		return this.add('sm:p-4')
	}

	smTwP8(): Tailwind {
		return this.add('sm:p-8')
	}

	smTwP16(): Tailwind {
		return this.add('sm:p-16')
	}

	smTwP24(): Tailwind {
		return this.add('sm:p-24')
	}

	smTwPy4(): Tailwind {
		return this.add('sm:py-4')
	}

	smTwPx4(): Tailwind {
		return this.add('sm:px-4')
	}

	smTwPy8(): Tailwind {
		return this.add('sm:py-8')
	}

	smTwPx8(): Tailwind {
		return this.add('sm:px-8')
	}

	smTwPy16(): Tailwind {
		return this.add('sm:py-16')
	}

	smTwPx16(): Tailwind {
		return this.add('sm:px-16')
	}

	smTwPy24(): Tailwind {
		return this.add('sm:py-24')
	}

	smTwPx24(): Tailwind {
		return this.add('sm:px-24')
	}

	smTwPt4(): Tailwind {
		return this.add('sm:pt-4')
	}

	smTwPr4(): Tailwind {
		return this.add('sm:pr-4')
	}

	smTwPb4(): Tailwind {
		return this.add('sm:pb-4')
	}

	smTwPl4(): Tailwind {
		return this.add('sm:pl-4')
	}

	smTwPt8(): Tailwind {
		return this.add('sm:pt-8')
	}

	smTwPr8(): Tailwind {
		return this.add('sm:pr-8')
	}

	smTwPb8(): Tailwind {
		return this.add('sm:pb-8')
	}

	smTwPl8(): Tailwind {
		return this.add('sm:pl-8')
	}

	smTwPt16(): Tailwind {
		return this.add('sm:pt-16')
	}

	smTwPr16(): Tailwind {
		return this.add('sm:pr-16')
	}

	smTwPb16(): Tailwind {
		return this.add('sm:pb-16')
	}

	smTwPl16(): Tailwind {
		return this.add('sm:pl-16')
	}

	smTwPt24(): Tailwind {
		return this.add('sm:pt-24')
	}

	smTwPr24(): Tailwind {
		return this.add('sm:pr-24')
	}

	smTwPb24(): Tailwind {
		return this.add('sm:pb-24')
	}

	smTwPl24(): Tailwind {
		return this.add('sm:pl-24')
	}

	smTwText14(): Tailwind {
		return this.add('sm:text-14')
	}

	smTwText16(): Tailwind {
		return this.add('sm:text-16')
	}

	smTwText18(): Tailwind {
		return this.add('sm:text-18')
	}

	// Building methods
	private add(value: string): Tailwind {
		this.value = `${this.value} ${value}`
		return this
	}
}
*/
