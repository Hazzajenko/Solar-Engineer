import { UserModel } from '../user.model';
import { createAction, props } from '@ngrx/store';

export const signIn = createAction(
  '[Auth Service] User SignIn',
  props<{ user: UserModel }>()
);

export const modifiedUser = createAction(
  '[Auth Service] Modified User',
  props<{ user: UserModel }>()
);

export const addToken = createAction(
  '[Auth Service] Add Token',
  props<{ token: string }>()
);

/*export const addUserProjects = createAction(
  '[Auth Service] Add User Projects',
  props<{ projects: ProjectModel[] }>()
);*/

export const signOut = createAction('[Auth Service] User SignOut');
