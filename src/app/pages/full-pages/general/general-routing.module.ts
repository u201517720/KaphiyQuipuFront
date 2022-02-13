import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoPagoComponent } from './operaciones/documentopago/documento-pago.component';
import { DocumentopagoEditComponent } from './operaciones/documentopago/edit/documentopago-edit.component';
import { DocumentoPagoPlantaComponent } from './operaciones/documentopagoplanta/documento-pago-planta.component';
import { DocumentopagoplantaEditComponent } from './operaciones/documentopagoplanta/edit/documentopagoplanta-edit.component';

const routes: Routes = [
  {
    path: 'operaciones',
    children: [
      {
        path: 'documentopago/list',
        component: DocumentoPagoComponent,
        data: {
          title: 'Documento Pago Acopio'
        }
      },
      {
        path: 'documentopago/update/:id',
        component: DocumentopagoEditComponent,
        data: {
          title: 'Documento Pago Acopio'
        }
      },
      {
        path: 'documentopagoplanta/list',
        component: DocumentoPagoPlantaComponent,
        data: {
          title: 'Documento Pago Planta'
        }
      },
      {
        path: 'documentopagoplanta/update/:id',
        component: DocumentopagoplantaEditComponent,
        data: {
          title: 'Documento Pago Planta'
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

