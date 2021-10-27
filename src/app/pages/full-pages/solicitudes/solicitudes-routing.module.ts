import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriaprimaComponent } from './materiaprima/materiaprima.component';

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

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SolicitudesRoutingModule { }

