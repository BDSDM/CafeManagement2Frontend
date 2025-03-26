import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  username: string = '';
  showPopup = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getStoredUserName() || '';
    this.showPopup = this.authService.getStoredBoolean();
  }
  closePopup() {
    this.showPopup = false; // Ferme la popup
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
  }
  goToUsersManagement() {
    this.showPopup = true; // Ferme la popup
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
    this.router.navigate(['/usermanagement']);
  }

  goToToDoList() {
    this.router.navigate(['/todolist']);
  }
  goToCookiesGame() {
    this.router.navigate(['/cookiesgame']);
  }
  logOut() {
    this.authService.logOut();
  }
}
