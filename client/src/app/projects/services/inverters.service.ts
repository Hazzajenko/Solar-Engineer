import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { InverterModel } from '../models/inverter.model';
import {
  addInverter,
  addInvertersByProjectId,
} from '../store/inverters/inverters.actions';
import { addTreeNode } from '../store/tree-node/tree-node.actions';
import { type } from './tree-nodes.service';

interface InvertersEnvelope {
  inverters: InverterModel[];
}

interface InverterEnvelope {
  inverter: InverterModel;
}

@Injectable({
  providedIn: 'root',
})
export class InvertersService {
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic29sYXJlbmdpbmVlci5kZXYiXSwiZXhwIjoxNjY4MDcxMDMzLCJuYmYiOjE2Njc5ODQ2MzMsImlhdCI6MTY2Nzk4NDYzMywianRpIjoiMSIsImlzcyI6InNvbGFyZW5naW5lZXIuZGV2IiwibmFtZSI6ImhhcnJ5Iiwic3ViIjoiMSJ9.X5pfkN7Wpq5lQZxVC-_PUVNpD1hoiIovPTrkNt_kpV4';

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

  createInverterByProjectId(projectId: number): Promise<InverterEnvelope> {
    // const token = localStorage.getItem('token');
    /*    console.log(token);
        this.store.select(selectToken).subscribe((token) => {
          console.log('hello');
          console.log(token);
          if (token) {
            console.log(token);
          }
        });*/
    return new Promise<InverterEnvelope>((resolve, reject) =>
      this.http
        .post<InverterEnvelope>(environment.apiUrl + `/projects/${projectId}`, {
          name: 'yes',
        })
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addInverter({ inverter: envelope.inverter }));
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('createInverterByProjectId');
          },
        })
    );
  }

  breakDownInvertersForTreeNode(inverters: InverterModel[]) {
    inverters.map((inverter) => {
      this.store.dispatch(
        addTreeNode({
          treeNode: {
            id: inverter.id,
            projectId: inverter.projectId,
            name: inverter.name,
            type: type.INVERTER,
            children: [],
          },
        })
      );
    });
  }
}
