import { createAction, props } from '@ngrx/store';
import { InverterModel } from '../../projects-models/inverter.model';

export const addInverter = createAction(
  '[Inverters Service] Add Inverter',
  props<{ inverter: InverterModel }>()
);

export const addInvertersByProjectId = createAction(
  '[Inverters Service] Add Inverters By ProjectId',
  props<{ inverters: InverterModel[] }>()
);
