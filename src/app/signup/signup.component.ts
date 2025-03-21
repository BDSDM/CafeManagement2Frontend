import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from '../global-constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  password = true;
  confirmPassword = true;
  signupForm: any = FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  SignUpError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private dialogRef: MatDialogRef<SignupComponent>
  ) {}
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      contactNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.contactNumberRegex),
        ],
      ],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validateSubmit() {
    if (
      this.signupForm.controls['password'].value !=
      this.signupForm.controls['confirmPassword'].value
    ) {
      return true;
    } else {
      return false;
    }
  }
  handleSubmit() {
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    };
    this.userService.registerUser(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.snackBar.open('Utilisateur enregistré avec succès', 'Fermer', {
          duration: 5000,
          verticalPosition: 'top', // ou 'bottom'
          horizontalPosition: 'center', // ou 'right', 'left'
        });
      },
      (error) => {
        this.SignUpError = true;
        console.error('Registration error:', error);
      }
    );
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Inverser l'état de visibilité
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible; // Inverser l'état de visibilité
  }
}
