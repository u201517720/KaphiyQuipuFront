import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratoComponent } from 'src/app/pages/full-pages/acopio/operaciones/contrato/contrato.component';
import { ContratoEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/contrato/edit/contrato-edit.component';
import { GuiaRecepcionComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiarecepcion/guia-recepcion.component';
import { GuiaRecepcionEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiarecepcion/edit/guia-recepcion-edit.component';
import { IngresoAlmacenComponent } from 'src/app/pages/full-pages/acopio/operaciones/ingresoalmacen/ingreso-almacen.component';
import { IngresoAlmacenEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/ingresoalmacen/edit/ingresoalmacen-edit.component';
import { OrdenprocesoComponent } from 'src/app/pages/full-pages/acopio/operaciones/ordenproceso/ordenproceso.component';
import { OrdenprocesoEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/ordenproceso/edit/ordenproceso-edit.component';
import { NotaIngresoDevolucionComponent } from 'src/app/pages/full-pages/acopio/operaciones/notaingresodevolucion/nota-ingreso-devolucion.component';
import { NotaIngresoDevolucionEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/notaingresodevolucion/edit/nota-ingreso-devolucion-edit.component';
import { GuiaRemisionDevolucionComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiaremisiondevolucion/guia-remision-devolucion.component';
import { GuiaRemisionDevolucionEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiaremisiondevolucion/edit/guia-remision-devolucion-edit.component';
import { GuiaremisionComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiaremision/guiaremision.component';
import { GuiaremisionEditComponent } from 'src/app/pages/full-pages/acopio/operaciones/guiaremision/edit/guiaremision-edit.component';

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
      },
      {
        path: 'notaingresoalmacen/list',
        component: IngresoAlmacenComponent,
        data: {
          title: 'Lista Nota Ingreso'
        }
      },
      {
        path: 'notaingresoalmacen/update/:id',
        component: IngresoAlmacenEditComponent,
        data: {
          title: 'Detalle Nota Ingreso'
        }
      },
      {
        path: 'ordenproceso/list',
        component: OrdenprocesoComponent,
        data: {
          title: 'Ordenes de Procesos'
        }
      },
      {
        path: 'ordenproceso/update/:id',
        component: OrdenprocesoEditComponent,
        data: {
          title: 'Orden de Proceso'
        }
      },
      {
        path: 'notaingresodevolucion/list',
        component: NotaIngresoDevolucionComponent,
        data: {
          title: 'Nota Ingreso Devolución'
        }
      },
      {
        path: 'notaingresodevolucion/create',
        component: NotaIngresoDevolucionEditComponent,
        data: {
          title: 'Nota Ingreso Devolución'
        }
      },
      {
        path: 'notaingresodevolucion/update/:id',
        component: NotaIngresoDevolucionEditComponent,
        data: {
          title: 'Nota Ingreso Devolución'
        }
      },
      {
        path: 'guiaremisiondevolucion/list',
        component: GuiaRemisionDevolucionComponent,
        data: {
          title: 'Guía Remisión Devolución'
        }
      },
      {
        path: 'guiaremisiondevolucion/update/:id',
        component: GuiaRemisionDevolucionEditComponent,
        data: {
          title: 'Guía Remisión Devolución'
        }
      },
      {
        path: 'guiaremision/list',
        component: GuiaremisionComponent,
        data: {
          title: 'Guía Remisión'
        }
      },
      {
        path: 'guiaremision/update/:id',
        component: GuiaremisionEditComponent,
        data: {
          title: 'Guía Remisión'
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

