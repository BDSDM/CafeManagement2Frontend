import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../services/reset-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.css'],
})
export class ConfirmResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private resetPasswordService: ResetPasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Récupération du token depuis l'URL
    this.token = this.route.snapshot.queryParamMap.get('token')!;
  }

  confirmReset() {
    this.resetPasswordService
      .confirmPasswordReset(this.token, this.newPassword)
      .subscribe(
        (response) => {
          this.message = response;
          this.error = '';
          this.snackBar.open('Mot de passe modifié avec succès', 'Fermer', {
            duration: 5000,
            verticalPosition: 'top', // ou 'bottom'
            horizontalPosition: 'center', // ou 'right', 'left'
          });

          this.router.navigate(['/home']);
        },
        (error) => {
          this.error = error.error.message;
          this.message = '';
        }
      );
  }
}
