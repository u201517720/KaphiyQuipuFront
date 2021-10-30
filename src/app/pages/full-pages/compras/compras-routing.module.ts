import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudcompraComponent } from './solicitudcompra/solicitudcompra.component';
import { SolicitudcompraEditComponent } from './solicitudcompra/edit/solicitudcompra-edit.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'solicitudcompra/list',
                component: SolicitudcompraComponent,
                data: {
                    title: 'Solicitud de Compra'
                }
            },
            {
                path: 'solicitudcompra/create',
                component: SolicitudcompraEditComponent,
                data: {
                    title: 'Solicitud de Compra'
                }
            },
            {
                path: 'solicitudcompra/update/:id',
                component: SolicitudcompraEditComponent,
                data: {
                    title: 'Solicitud de Compra'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CompraRoutingModule { }

