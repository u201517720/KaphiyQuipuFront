import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from "./login/login-page.component";
import { ForgotPasswordComponent } from "./ForgotPassword/ForgotPassword.component";
import { ValoracionAgricultorComponent } from './valoracion-agricultor/valoracion-agricultor.component';


const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'forgotPass',
        component: ForgotPasswordComponent,
        data: {
          title: 'Login Page'
        }
      },
      {
        path: 'valoracion-cafe',
        component: ValoracionAgricultorComponent,
        data: {
          title: 'Valoración Cafe'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
