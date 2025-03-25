import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsermanagementGuard implements CanActivate {
  userRole: string = '';
  showPopup = false;
  storeShowpup = false;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    this.userRole = this.authService.getStoredUserRole() || '';

    if (this.authService.isAuthenticated() && this.userRole === 'admin') {
      return true;
    }
    this.showPopup = true;
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));

    this.router.navigate(['/dashboard']);
    return false;
  }
}
