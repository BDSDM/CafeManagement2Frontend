import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { UsermanagementGuard } from './guards/usermagement.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'usermanagement',
    component: UsermanagementComponent,
    canActivate: [UsermanagementGuard],
  },
  { path: 'home', component: HomeComponent }, // Route vers HomeComponent
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: 'home' }, // Gestion des routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
