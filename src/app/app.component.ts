import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cafeManagement2Frontend';
  showPopup: boolean = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.checkActivity();
  }
}
