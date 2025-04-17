import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../services/reset-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css'],
})
export class RequestResetPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  requestReset() {
    console.log('Email envoyé:', this.email); // Vérifie l'email saisi

    this.resetPasswordService.requestPasswordReset(this.email).subscribe(
      (response) => {
        console.log("Réponse de l'API reçue:", response); // Vérifie la réponse
        this.message = 'Email envoyé';
        this.error = '';
        this.snackBar.open(
          'Mail de réinitialisation envoyé avec succès',
          'Fermer',
          {
            duration: 5000,
            verticalPosition: 'top', // ou 'bottom'
            horizontalPosition: 'center', // ou 'right', 'left'
          }
        );
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur lors de la requête:', error); // Vérifie les erreurs
        this.error =
          error.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.message = '';
      }
    );
  }
}
