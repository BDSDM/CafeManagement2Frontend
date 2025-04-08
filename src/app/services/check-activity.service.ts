import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assure-toi d'avoir un AuthService qui gère la connexion
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class CheckActivityService {
  private checkInterval = 10000; // Vérifier toutes les 10 secondes
  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  startChecking() {
    setInterval(() => {
      const token = this.authService.getToken();
      if (token && this.jwtHelper.isTokenExpired(token)) {
        this.userService.logoutFromApp();
      }
    }, this.checkInterval);
  }
}
