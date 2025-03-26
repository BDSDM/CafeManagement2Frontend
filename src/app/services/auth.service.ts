import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmLogoutDialogComponent } from '../confirm-logout-dialog/confirm-logout-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth'; // URL backend

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, credentials, {
      responseType: 'text',
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getStoredUserId(): number {
    const userId = localStorage.getItem('id');
    return userId ? +userId : 0; // Si l'ID est trouvé, on le convertit en nombre, sinon on retourne 0
  }
  getStoredUserEmail(): string | null {
    return localStorage.getItem('sub');
  }
  getStoredBoolean(): boolean {
    return JSON.parse(localStorage.getItem('showPopup') || 'false');
  }

  getStoredUserName(): string {
    return localStorage.getItem('name') || '';
  }
  getStoredUserRole(): string {
    return localStorage.getItem('role') || '';
  }
  checkActivity() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const jwt = JSON.parse(atob(token.split('.')[1]));
        const expires = new Date(jwt.exp * 1000);
        const timeout = expires.getTime() - Date.now();
        if (timeout <= 0) {
          this.logOut();
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error('Erreur lors du traitement du token JWT :', e.message);
      } else {
        console.error('Erreur inconnue lors du traitement du token JWT :', e);
      }
      this.logOut();
    }
  }

  logOut() {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si l'utilisateur confirme la déconnexion
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
      }
    });
  }
}
