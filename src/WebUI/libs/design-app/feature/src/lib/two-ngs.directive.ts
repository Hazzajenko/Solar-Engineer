import {
	Directive,
	EmbeddedViewRef,
	Input,
	TemplateRef,
	ViewContainerRef,
	ɵstringify as stringify,
} from '@angular/core'
import { NgIf, NgIfContext } from '@angular/common'

export type ConditionTuple<T, X> = [T, X]

@Directive({
	selector: '[appNgIf]',
	standalone: true,
})
export class NgIfDirective<T = unknown> {
	private _context: NgIfContext<T> = new NgIfContext<T>()
	// private _context2: AppNgIfContext<X> = new AppNgIfContext<X>()
	private _thenTemplateRef: TemplateRef<NgIfContext<T>> | null = null
	// private _thenTemplateRef2: TemplateRef<AppNgIfContext<X>> | null = null
	private _elseTemplateRef: TemplateRef<NgIfContext<T>> | null = null
	private _thenViewRef: EmbeddedViewRef<NgIfContext<T>> | null = null
	private _elseViewRef: EmbeddedViewRef<NgIfContext<T>> | null = null

	constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfContext<T>>) {
		this._thenTemplateRef = templateRef
	}

	/**
	 * The Boolean expression to evaluate as the condition for showing a template.
	 */
	@Input() set ngIf(condition: T) {
		this._context.$implicit = this._context.ngIf = condition
		console.log('NgIfDirective', condition)
		// this._context2.$implicit = this._context2.appNgIf = condition[1]
		this._updateView()
	}

	/**
	 * A template to show if the condition expression evaluates to true.
	 */
	@Input() set appNgIfThen(templateRef: TemplateRef<NgIfContext<T>> | null) {
		assertTemplate('appNgIfThen', templateRef)
		this._thenTemplateRef = templateRef
		this._thenViewRef = null // clear previous view if any.
		this._updateView()
	}

	/**
	 * A template to show if the condition expression evaluates to false.
	 */
	@Input() set appNgIfElse(templateRef: TemplateRef<NgIfContext<T>> | null) {
		assertTemplate('appNgIfElse', templateRef)
		this._elseTemplateRef = templateRef
		this._elseViewRef = null // clear previous view if any.
		this._updateView()
	}

	private _updateView() {
		if (this._context.$implicit) {
			if (!this._thenViewRef) {
				this._viewContainer.clear()
				this._elseViewRef = null
				if (this._thenTemplateRef) {
					this._thenViewRef = this._viewContainer.createEmbeddedView(
						this._thenTemplateRef,
						this._context, // this._context2,
					)
				}
			}
		} else {
			if (!this._elseViewRef) {
				this._viewContainer.clear()
				this._thenViewRef = null
				if (this._elseTemplateRef) {
					this._elseViewRef = this._viewContainer.createEmbeddedView(
						this._elseTemplateRef, // { ...this._context, ...this._context2 } as AppNgIfContext<T & X>,
						this._context,
					)
				}
			}
		}
	}

	/** @internal */
	public static appNgIfUseIfTypeGuard: void

	/**
	 * Assert the correct type of the expression bound to the `appNgIf` input within the template.
	 *
	 * The presence of this static field is a signal to the Ivy template type check compiler that
	 * when the `NgIf` structural directive renders its template, the type of the expression bound
	 * to `appNgIf` should be narrowed in some way. For `NgIf`, the binding expression itself is used to
	 * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgIf`.
	 */
	static ngTemplateGuard_appNgIf: 'binding'

	/**
	 * Asserts the correct type of the context for the template that `NgIf` will render.
	 *
	 * The presence of this method is a signal to the Ivy template type-check compiler that the
	 * `NgIf` structural directive renders its template with a specific context type.
	 */
	static ngTemplateContextGuard<T>(
		dir: NgIf<T>,
		ctx: any,
	): ctx is NgIfContext<Exclude<T, false | 0 | '' | null | undefined>> {
		return true
	}
}

/**
 * @publicApi
 */

/*export class NgIfContext<T = unknown> {
 public $implicit: T = null!
 public appNgIf: T = null!
 }*/

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
	const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView)
	if (!isTemplateRefOrNull) {
		throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`)
	}
}
