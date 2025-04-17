import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  loginError: boolean = false;
  signInForm: any = FormGroup;
  passwordVisible: boolean = false;
  errorMessage = '';
  showPopup = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SigninComponent>
  ) {}

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    var formData = this.signInForm.value;
    var data = {
      email: formData.email,
      password: formData.password,
    };

    // Appel au service d'authentification
    this.authService.login(data).subscribe(
      (response) => {
        this.dialogRef.close();

        // Parse the JSON string into an object
        const tokens = JSON.parse(response); // response is a JSON string

        const accessToken = tokens.accessToken; // Accéder au access token
        const refreshToken = tokens.refreshToken; // Accéder au refresh token
        // Stocker les tokens dans le localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Décoder le payload du access token
        const payload = accessToken.split('.')[1]; // Prendre la seconde partie du token
        const decodedPayload = JSON.parse(atob(payload)); // Décoder la partie payload

        // Extraire les informations utilisateur du payload
        const userRole = decodedPayload.role;
        const userName = decodedPayload.name;
        const userEmail = decodedPayload.sub;
        const userId = decodedPayload.id;

        // Stocker les informations utilisateur dans le localStorage
        localStorage.setItem('role', userRole);
        localStorage.setItem('name', userName);
        localStorage.setItem('sub', userEmail);
        localStorage.setItem('id', userId.toString());

        // Redirection vers le dashboard après connexion réussie
        this.showPopup = false;
        localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.loginError = true;
        this.errorMessage = 'Identifiants incorrects !';
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Inverser l'état de visibilité du mot de passe
  }
}
