import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserData } from '../models/user.model';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-update-user',
  templateUrl: './update.component.html', // Assurez-vous que le chemin du template est correct
})
export class UpdateComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserData
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.updateForm = this.fb.group({
        name: [this.data.user.name, Validators.required],
        email: [this.data.user.email, [Validators.required, Validators.email]],
        contactNumber: [
          this.data.user.contactNumber,
          [
            Validators.required,
            Validators.pattern(GlobalConstants.contactNumberRegex),
          ],
        ],

        status: [this.data.user.status, Validators.required],
        role: [this.data.user.role, Validators.required],
      });
    } else {
      console.error(
        "L'objet utilisateur est manquant dans les données injectées"
      );
      this.dialogRef.close();
    }
  }

  handleUpdate(): void {
    if (this.updateForm.valid && this.data?.user?.id) {
      const updatedData = this.updateForm.value;

      this.userService.updateUser(this.data.user.id, updatedData).subscribe(
        (response: User) => {
          this.dialogRef.close(response);
          this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
        (error) => {
          console.error(
            "Erreur lors de la mise à jour de l'utilisateur :",
            error
          );
          this.snackBar.open(
            "Échec de la mise à jour de l'utilisateur",
            'Fermer',
            {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            }
          );
        }
      );
    }
  }
}
