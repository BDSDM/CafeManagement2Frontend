import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  loginError: boolean = false;
  signInForm: any = FormGroup;
  password = true;
  passwordVisible: boolean = false;
  errorMessage = '';
  showPopup = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
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

    {
      this.authService.login(data).subscribe(
        (response) => {
          this.dialogRef.close();
          const token = response; // Récupère le token
          const payload = token.split('.')[1]; // Prend la seconde partie du token
          const decodedPayload = JSON.parse(atob(payload)); // Décode la partie payload

          const userRole = decodedPayload.role;
          localStorage.setItem('role', userRole);
          const userName = decodedPayload.name;
          const userEmail = decodedPayload.sub;

          const userId = decodedPayload.id;
          localStorage.setItem('id', userId);
          localStorage.setItem('sub', userEmail);

          // Stocker le nom dans le localStorage ou via un service
          localStorage.setItem('name', userName); // Stocker le nom de l'utilisateur

          localStorage.setItem('token', response);
          this.showPopup = false; // Ferme la popup
          localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
          this.router.navigate(['/dashboard']); // Redirection après connexion réussie
        },
        (error) => {
          this.loginError = true;
          this.errorMessage = 'Identifiants incorrects !';
        }
      );
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Inverser l'état de visibilité
  }
}
