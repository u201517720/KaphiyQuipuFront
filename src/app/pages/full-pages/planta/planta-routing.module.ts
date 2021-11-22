import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotaIngresoPlantaComponent } from './operaciones/notaingresoplanta/nota-ingreso-planta.component';
import { NotaIngresoPlantaEditComponent } from './operaciones/notaingresoplanta/edit/nota-ingreso-planta-edit.component';

const routes: Routes = [
    {
        path: 'operaciones',
        children: [
            {
                path: 'notaingreso/list',
                component: NotaIngresoPlantaComponent,
                data: {
                    title: 'Notas de Ingresos'
                }
            },
            {
                path: 'notaingreso/create',
                component: NotaIngresoPlantaEditComponent,
                data: {
                    title: 'Nota de Ingreso'
                }
            },
            {
                path: 'notaingreso/update/:id',
                component: NotaIngresoPlantaEditComponent,
                data: {
                    title: 'Nota de Ingreso'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PlantaRoutingModule { }

