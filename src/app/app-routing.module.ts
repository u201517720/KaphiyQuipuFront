import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FullLayoutComponent } from './layouts/full/full-layout.component';
import { ContentLayoutComponent } from "src/app/layouts/content/content-layout.component";
import { Full_ROUTES } from "src/app/shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "src/app/shared/routes/content-layout.routes";
import { AuthGuard } from 'src/app/shared/auth/auth-guard.service';

const appRoutes = [
  { path: '', redirectTo: 'pages/login', pathMatch: 'full' },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: 'pages/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }