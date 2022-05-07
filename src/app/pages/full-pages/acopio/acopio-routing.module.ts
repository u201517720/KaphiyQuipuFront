import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratoComponent } from './operaciones/contrato/contrato.component';
import { ContratoEditComponent } from './operaciones/contrato/edit/contrato-edit.component';
import { GuiaRecepcionComponent } from './operaciones/guiarecepcion/guia-recepcion.component';
import { GuiaRecepcionEditComponent } from './operaciones/guiarecepcion/edit/guia-recepcion-edit.component';
import { IngresoAlmacenComponent } from './operaciones/ingresoalmacen/ingreso-almacen.component';
import { IngresoAlmacenEditComponent } from './operaciones/ingresoalmacen/edit/ingresoalmacen-edit.component';
import { OrdenprocesoComponent } from './operaciones/ordenproceso/ordenproceso.component';
import { OrdenprocesoEditComponent } from './operaciones/ordenproceso/edit/ordenproceso-edit.component';
import { NotaIngresoDevolucionComponent } from './operaciones/notaingresodevolucion/nota-ingreso-devolucion.component';
import { NotaIngresoDevolucionEditComponent } from './operaciones/notaingresodevolucion/edit/nota-ingreso-devolucion-edit.component';
import { GuiaRemisionDevolucionComponent } from './operaciones/guiaremisiondevolucion/guia-remision-devolucion.component';
import { GuiaRemisionDevolucionEditComponent } from './operaciones/guiaremisiondevolucion/edit/guia-remision-devolucion-edit.component';
import { GuiaremisionComponent } from './operaciones/guiaremision/guiaremision.component';
import { GuiaremisionEditComponent } from './operaciones/guiaremision/edit/guiaremision-edit.component';
import { ProyectarVentaComponent } from './operaciones/proyectarventa/proyectar-venta.component';

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
      },
      {
        path: 'proyectarventa',
        component: ProyectarVentaComponent,
        data: {
          title: 'Proyección de Venta'
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

