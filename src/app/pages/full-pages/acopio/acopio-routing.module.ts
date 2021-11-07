import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuiaRecepcionComponent } from './operaciones/guiarecepcion/guia-recepcion.component';
import { ContratoComponent } from './operaciones/contrato/contrato.component';
import { ContratoEditComponent } from './operaciones/contrato/edit/contrato-edit.component';

const routes: Routes = [
  {
    path: 'operaciones',
    children: [
      {
        path: 'guiarecepcion/list',
        component: GuiaRecepcionComponent,
        data: {
          title: 'Guías de Recepción'
        }
      },
      {
        path: 'contrato/list',
        component: ContratoComponent,
        data: {
          title: 'Lista Contratos'
        }
      },
      {
        path: 'contrato/update/:id',
        component: ContratoEditComponent,
        data: {
          title: 'Lista Contratos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcopioRoutingModule { }

