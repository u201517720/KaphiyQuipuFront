import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratoComponent } from './operaciones/contrato/contrato.component';
import { ContratoEditComponent } from './operaciones/contrato/edit/contrato-edit.component';
import { GuiaRecepcionComponent } from './operaciones/guiarecepcion/guia-recepcion.component';
import { GuiaRecepcionEditComponent } from './operaciones/guiarecepcion/edit/guia-recepcion-edit.component';

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
        path: 'guiarecepcion/update/:id',
        component: GuiaRecepcionEditComponent,
        data: {
          title: 'Detalle Guía Recepción'
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

