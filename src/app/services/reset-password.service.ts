import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private apiUrl = 'http://localhost:8080/api/reset-password';

  constructor(private http: HttpClient) {}

  // Envoie la demande de réinitialisation de mot de passe
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { email });
  }

  // Confirme la réinitialisation du mot de passe
  confirmPasswordReset(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, { token, newPassword });
  }
}
