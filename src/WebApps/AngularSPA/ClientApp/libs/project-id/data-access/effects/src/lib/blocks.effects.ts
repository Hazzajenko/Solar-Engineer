import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { PanelsFacade } from '@project-id/data-access/facades';

@Injectable()
export class BlocksEffects {
  private actions$ = inject(Actions)
  private panelsFacade = inject(PanelsFacade)

}
