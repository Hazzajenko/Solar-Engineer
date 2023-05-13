import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
import { AuthFacade } from '@auth/data-access'
import { Observable, Subscription } from 'rxjs'
import { AuthUserModel } from '@shared/data-access/models'
import { NgIfContext } from '@angular/common'
import { rejectNil } from '@shared/utils'

@Directive({
  selector: '[appUser]',
  standalone: true,
})
export class UserDirective implements OnInit, OnDestroy {
  static ngTemplateGuard_appUser: 'binding'
  private _context: NgIfContext<Observable<AuthUserModel>> = new NgIfContext<Observable<AuthUserModel>>()
  // private static _user: AuthUserModel | undefined
  private _vcr = inject(ViewContainerRef)
  private _template = inject(TemplateRef<NgIfContext<Observable<AuthUserModel>>>)
  private authFacade = inject(AuthFacade)
  private _subscription: Subscription | undefined
  private _user: AuthUserModel | undefined

  /*  static ngTemplateContextGuard(
   dir: UserDirective,
   ctx: unknown,
   ): ctx is AuthUserModel {
   return true
   }*/

  @Input() set appUser(val: any) {
    this._context.$implicit = this.authFacade.user$.pipe(
      rejectNil(),
      // throwIfEmpty(() => new Error('No user found')),
    )
    this._vcr.createEmbeddedView(this._template, this._context)

  }

  /*  static ngTemplateGuard_appUser(
   dir: UserDirective,
   ): AuthUserModel | undefined {
   return this._user
   }*/

  ngOnInit(): void {
    console.log('UserDirective.ngOnInit()')
    // this._vcr.createEmbeddedView(this._template, { $implicit: this.authFacade.user$ })
    /*    this._subscription = this.authFacade.user$.subscribe((user) => {
     if (user) {
     this._user = user
     this._vcr.createEmbeddedView(this._template, { $implicit: user })
     } else {
     this._vcr.clear()
     }
     },
     )*/
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe()
  }

}