import { createAction, props } from "@ngrx/store";
import { UserProjectModel } from "../../models/deprecated-for-now/user-project.model";

export const addUserProject = createAction(
	"[UserProjects Service] Add UserProject",
	props<{ userProject: UserProjectModel }>(),
);

export const addUserProjects = createAction(
	"[UserProjects Service] Add UserProject",
	props<{ userProjects: UserProjectModel[] }>(),
);
