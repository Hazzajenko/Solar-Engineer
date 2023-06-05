import { ProjectId, ProjectModel, StringId, StringModel } from '@entities/shared'

export const addProjectId = <T extends object>(project: ProjectModel | ProjectId, object: T) => {
	if (typeof project === 'string') {
		return {
			...object,
			projectId: project,
		}
	} else {
		return {
			...object,
			projectId: project.id,
		}
	}
}

export const addStringId = <T extends object>(stringId: StringId, object: T) => {
	return {
		...object,
		stringId,
	}
}

export const addProjectIdAndStringId = <T extends object>(
	project: ProjectModel | ProjectId,
	string: StringModel | StringId,
	object: T,
) => {
	return {
		...object,
		projectId: typeof project === 'string' ? project : project.id,
		stringId: typeof string === 'string' ? string : string.id,
	}
}

export const addProjectIdToArray = <T extends object>(
	objects: T[],
	arrayName: string,
	project: ProjectModel | ProjectId,
) => {
	return {
		[arrayName]: objects,
		projectId: typeof project === 'string' ? project : project.id,
	}
}

export const addProjectIdAndStringIdToArray = <T extends object>(
	objects: T[],
	arrayName: string,
	project: ProjectModel | ProjectId,
	string: StringModel | StringId,
) => {
	return {
		[arrayName]: objects,
		projectId: typeof project === 'string' ? project : project.id,
		stringId: typeof string === 'string' ? string : string.id,
	}
}

export function addProjectIdAndStringIdToAll<T extends object>(
	project: ProjectModel | ProjectId,
	string: StringModel | StringId,
	objects: T[],
): T[] {
	return objects.map((object) => addProjectIdAndStringId(project, string, object))
}

export function addItemsToObject<TObject extends object, TOne>(
	object: TObject,
	itemOne: TOne,
): TObject & TOne
export function addItemsToObject<TObject extends object, TOne, TTwo>(
	object: TObject,
	itemOne: TOne,
	itemTwo: TTwo,
): TObject & TOne & TTwo
export function addItemsToObject(object: object, ...items: any[]): any {
	return Object.assign({}, object, ...items)
}

/*
 export function addItemsToObject<TObject extends object, TOne>(object: TObject, itemOne: TOne) {
 return {
 object,
 ...itemOne,
 }
 }

 export function addItemsToObject<TObject extends object, TOne, TTwo>(
 object: TObject,
 itemOne: TOne,
 itemTwo: TTwo,
 ) {
 return {
 object,
 ...itemOne,
 ...itemTwo,
 }
 }
 */
