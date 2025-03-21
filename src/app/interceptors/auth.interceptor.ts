// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('token');

    // Si un token existe, ajouter l'en-tête d'autorisation à la requête
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Ajouter le token JWT dans l'en-tête Authorization
        },
      });

      // Passer la requête clonée avec le header d'autorisation
      return next.handle(clonedRequest);
    }

    // Si aucun token n'est disponible, continuer la requête sans modification
    return next.handle(req);
  }
}
