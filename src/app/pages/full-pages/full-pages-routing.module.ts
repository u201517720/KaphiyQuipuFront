import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: 'acopio',
    loadChildren: () => import('../../pages/full-pages/acopio/acopio.module').then(m => m.AcopioModule)
  },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Home Page'
        }
      }
    ]
  },
  {
    path: 'compras',
    loadChildren: () => import('./compras/compras.module').then(m => m.ComprasModule)
  },
  {
    path: 'productor',
    loadChildren: () => import('./productor/productor.module').then(m => m.ProductorModule)
  },
  {
    path: 'planta',
    loadChildren: () => import('./planta/planta.module').then(m => m.PlantaModule)
  },
  {
    path: 'general',
    loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPagesRoutingModule { }
