import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // ✅ Import nécessaire
import { MatInputModule } from '@angular/material/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { MatTableModule } from '@angular/material/table';
import { UpdateComponent } from './update/update.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MatListModule } from '@angular/material/list';
import { CookiesgameComponent } from './cookiesgame/cookiesgame.component';
import { ConfirmLogoutDialogComponent } from './confirm-logout-dialog/confirm-logout-dialog.component';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CookieService } from 'ngx-cookie-service';
import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    DashboardComponent,
    UsermanagementComponent,
    UpdateComponent,
    ConfirmDeleteComponent,
    TodoListComponent,
    CookiesgameComponent,
    ConfirmLogoutDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    HttpClientModule,
    MatSidenavModule,
    MatTableModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    MatPaginatorModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
