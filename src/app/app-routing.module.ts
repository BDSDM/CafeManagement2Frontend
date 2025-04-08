import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { UsermanagementGuard } from './guards/usermagement.guard';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodolistGuard } from './guards/todolist.guard';
import { CookiesgameComponent } from './cookiesgame/cookiesgame.component';
import { CookiesgameGuard } from './guards/cookiesgame.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'cookiesgame',
    component: CookiesgameComponent,
    canActivate: [CookiesgameGuard],
  },
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
  {
    path: 'todolist',
    component: TodoListComponent,
    canActivate: [TodolistGuard],
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
