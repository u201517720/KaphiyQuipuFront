import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriaprimaComponent } from './materiaprima/materiaprima.component';
import { MateriaprimaEditComponent } from './materiaprima/edit/materiaprima-edit.component';
import { CosechaComponent } from './cosecha/cosecha.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'materiaprima/list',
                component: MateriaprimaComponent,
                data: {
                    title: 'Lista de Solicitudes de Materia Prima'
                }
            },
            {
                path: 'materiaprima/update/:id',
                component: MateriaprimaEditComponent,
                data: {
                    title: 'Detalle de la solicitud de materia prima'
                }
            },
            {
                path: 'cosecha/list',
                component: CosechaComponent,
                data: {
                    title: 'Lista del registro de cosechas'
                }
            },
            {
                path: 'cosecha/create',
                component: CosechaComponent,
                data: {
                    title: 'Lista del registro de cosechas'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductorRoutingModule { }

