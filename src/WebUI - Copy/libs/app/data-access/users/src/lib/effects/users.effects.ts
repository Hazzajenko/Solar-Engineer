import { inject, Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { UsersService } from '../api'
import { AuthFacade } from '@auth/data-access'

@Injectable({
  providedIn: 'root',
})
export class UsersEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private usersService = inject(UsersService)
  private authFacade = inject(AuthFacade)

  /*initUsers$ = createEffect(() =>
   this.actions$.pipe(
   ofType(AuthActions.signInSuccess),
   switchMap(() =>
   this.usersService.getAllFriends().pipe(
   map((res) => {
   if (!res.appUserLinks) {
   return UsersActions.emptyUsersEvent()
   }
   if (res.appUserLinks.length < 1) {
   return UsersActions.emptyUsersEvent()
   }
   return UsersActions.addManyUsers({ users: res.appUserLinks })
   }),
   ),
   ),
   ),
   )

   getUserByUserName$ = createEffect(() =>
   this.actions$.pipe(
   ofType(UsersActions.getUserByUsername),
   switchMap(({ userName }) =>
   this.usersService
   .getUserByUserNameV2(userName)
   .pipe(map((res) => UsersActions.addUser({ user: res.user }))),
   ),
   ),
   )

   updateAppUserDisplayPictureWithIcon = createEffect(
   () =>
   this.actions$.pipe(
   ofType(UsersActions.updateAppuserDisplayPictureWithIcon),
   switchMap(({ request }) =>
   this.usersService.updateDisplayPicture(request).pipe(
   map(() => {
   const update: Partial<UserModel> = {
   photoUrl: request.image.imageName,
   }
   return AuthActions.updateUser({ update })
   }),
   catchError((err: Error) => of(AuthActions.addError({ error: err.message }))),
   ),
   ),
   ),
   // { dispatch: false }
   )

   sendFriendRequest$ = createEffect(
   () =>
   this.actions$.pipe(
   ofType(UsersActions.sendFriendRequest),
   switchMap(({ userName }) => this.usersService.sendFriendRequest(userName)),
   ),
   { dispatch: false },
   )

   acceptFriendRequest$ = createEffect(
   () =>
   this.actions$.pipe(
   ofType(UsersActions.acceptFriendRequest),
   switchMap(({ userName }) => this.usersService.acceptFriendRequest(userName)),
   ),
   { dispatch: false },
   )

   rejectFriendRequest$ = createEffect(
   () =>
   this.actions$.pipe(
   ofType(UsersActions.rejectFriendRequest),
   switchMap(({ userName }) => this.usersService.rejectFriendRequest(userName)),
   ),
   { dispatch: false },
   )*/
}
