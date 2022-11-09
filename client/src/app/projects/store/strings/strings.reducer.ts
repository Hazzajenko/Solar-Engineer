import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as StringsActions from './strings.actions';
import { StringModel } from '../../models/string.model';

export const selectStringId = (b: StringModel): number => b.id;
export const sortByStringName = (a: StringModel, b: StringModel): number =>
  a.name.localeCompare(b.name);

export const stringAdapter: EntityAdapter<StringModel> =
  createEntityAdapter<StringModel>({
    selectId: selectStringId,
    sortComparer: sortByStringName,
  });

export const initialStringsState = stringAdapter.getInitialState({});

export const stringsReducer = createReducer(
  initialStringsState,

  on(StringsActions.addString, (state, { stringModel }) =>
    stringAdapter.addOne(stringModel, state)
  ),

  on(StringsActions.addStringsByProjectId, (state, { stringModels }) =>
    stringAdapter.addMany(stringModels, state)
  ),

  on(StringsActions.updateString, (state, { string }) =>
    stringAdapter.updateOne(
      {
        id: string.id,
        changes: string,
      },
      state
    )
  )
);

export const { selectIds, selectEntities, selectAll } =
  stringAdapter.getSelectors();

export type StringState = EntityState<StringModel>;
