import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
})
export class ConfirmDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    private snackBar: MatSnackBar
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Renvoie `true` si confirmé
    this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', {
      duration: 5000,
      verticalPosition: 'top', // ou 'bottom'
      horizontalPosition: 'center', // ou 'right', 'left'
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); // Renvoie `false` si annulé
  }
}
