import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { InverterModel } from '../projects-models/inverter.model';
import { addInvertersByProjectId } from '../projects-store/inverters/inverters.actions';

interface InvertersEnvelope {
  inverters: InverterModel[];
}

@Injectable({
  providedIn: 'root',
})
export class InvertersService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getInvertersByProjectId(projectId: number): Promise<InvertersEnvelope> {
    return new Promise<InvertersEnvelope>((resolve, reject) =>
      this.http
        .get<InvertersEnvelope>(environment.apiUrl + `/projects/${projectId}`)
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              addInvertersByProjectId({ inverters: envelope.inverters })
            );
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('getInvertersByProjectId');
          },
        })
    );
  }
}
