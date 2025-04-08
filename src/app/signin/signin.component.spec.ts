import { TestBed } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import pour gérer les animations

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: any;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let dialogRef: MatDialogRef<SigninComponent>;

  beforeEach(async () => {
    // Créer un espion pour AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [
        MatToolbarModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, // Import ReactiveFormsModule pour les formulaires réactifs
        BrowserAnimationsModule, // Ajoutez ce module pour les animations
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') },
        },
        {
          provide: AuthService,
          useValue: authServiceSpy, // Utiliser l'espion au lieu du service réel
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dialogRef = TestBed.inject(MatDialogRef);

    // Appeler ngOnInit explicitement pour initialiser le formulaire
    component.ngOnInit();

    fixture.detectChanges(); // Assurez-vous que les changements ont été détectés
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with email and password controls', () => {
    expect(component.signInForm.contains('email')).toBeTrue();
    expect(component.signInForm.contains('password')).toBeTrue();
  });

  it('should require email and password fields to be filled in', () => {
    let emailControl = component.signInForm.get('email');
    let passwordControl = component.signInForm.get('password');

    // Avant de définir des valeurs
    expect(emailControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();

    // Définir des valeurs valides
    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password123');

    expect(emailControl?.valid).toBeTrue();
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should handle form submission with invalid credentials', () => {
    // Simuler une erreur lors de la connexion
    const loginError = 'Invalid credentials';
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error(loginError))
    ); // Utiliser l'espion

    component.signInForm.setValue({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.loginError).toBeTrue();
    expect(component.errorMessage).toBe('Identifiants incorrects !');

    // Vérifier que la navigation n'a PAS eu lieu
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should handle form submission with invalid credentials', () => {
    // Simuler une erreur lors de la connexion
    const loginError = 'Invalid credentials';
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error(loginError))
    ); // Utiliser l'espion

    component.signInForm.setValue({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    component.handleSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.loginError).toBeTrue();
    expect(component.errorMessage).toBe('Identifiants incorrects !');
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();

    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();

    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });
});
