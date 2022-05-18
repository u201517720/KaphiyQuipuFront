import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MateriaprimaComponent } from './operaciones/materiaprima/materiaprima.component';
import { MateriaprimaEditComponent } from './operaciones/materiaprima/edit/materiaprima-edit.component';
import { CosechaComponent } from './operaciones/cosecha/cosecha.component';
import { CosechaEditComponent } from './operaciones/cosecha/edit/cosecha-edit.component';
import { ProyectarCosechaComponent } from './operaciones/proyectarcosecha/proyectar-cosecha.component';
import { ValoracionComponent } from './operaciones/valoracion/valoracion.component';

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
                component: CosechaEditComponent,
                data: {
                    title: 'Lista del registro de cosechas'
                }
            },
            {
                path: 'proyectarcosecha',
                component: ProyectarCosechaComponent,
                data: {
                    title: 'Proyectar Cosecha'
                }
            },
            {
                path: 'valoracioncafe',
                component: ValoracionComponent,
                data: {
                    title: 'Valoración del Café'
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

