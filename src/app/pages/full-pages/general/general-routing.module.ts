import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoPagoComponent } from './operaciones/documentopago/documento-pago.component';

const routes: Routes = [
  {
    path: 'operaciones',
    children: [
      {
        path: 'documentopago/list',
        component: DocumentoPagoComponent,
        data: {
          title: 'Guías de Recepción'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule { }

