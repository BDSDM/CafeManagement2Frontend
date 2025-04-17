import { Component } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { SigninComponent } from '../signin/signin.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private dialog: MatDialog, private router: Router) {}
  ngOnInit(): void {}
  changePassord() {
    this.router.navigate(['/reset-password/request']);
  }

  handleSignUpAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.disableClose = true; // Empêche la fermeture en cliquant à l'extérieur
    this.dialog.open(SignupComponent, dialogConfig);
  }
  handleSignInAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.disableClose = true; // Empêche la fermeture en cliquant à l'extérieur
    this.dialog.open(SigninComponent, dialogConfig);
  }
}
