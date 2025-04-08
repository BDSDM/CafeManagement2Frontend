import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SignupComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [SignupComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form with empty values', () => {
    expect(component.signupForm.value).toEqual({
      name: null,
      email: null,
      contactNumber: null,
      password: null,
      confirmPassword: null,
    });
  });

  it('should invalidate form when required fields are empty', () => {
    component.signupForm.controls['name'].setValue('');
    component.signupForm.controls['email'].setValue('');
    component.signupForm.controls['contactNumber'].setValue('');
    component.signupForm.controls['password'].setValue('');
    component.signupForm.controls['confirmPassword'].setValue('');

    expect(component.signupForm.valid).toBeFalse();
  });

  it('should validate email format correctly', () => {
    component.signupForm.controls['email'].setValue('invalid-email');
    expect(component.signupForm.controls['email'].valid).toBeFalse();

    component.signupForm.controls['email'].setValue('valid@example.com');
    expect(component.signupForm.controls['email'].valid).toBeTrue();
  });

  it('should validate password and confirm password match', () => {
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue(
      'differentPassword'
    );
    expect(component.validateSubmit()).toBeTrue();

    component.signupForm.controls['confirmPassword'].setValue('password123');
    expect(component.validateSubmit()).toBeFalse();
  });

  it('should call userService.registerUser and close dialog on successful registration', () => {
    // Mock d'un utilisateur conforme à l'interface User
    const mockUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '0681470311',
      status: 'active',
      role: 'user',
    };

    component.signupForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '0681470311',
      password: 'password123',
      confirmPassword: 'password123',
    });

    // On retourne l'utilisateur mocké plutôt qu'un message
    userServiceSpy.registerUser.and.returnValue(of(mockUser));

    component.handleSubmit();
    fixture.detectChanges(); // Ajout pour détecter les changements après l'appel du service

    expect(userServiceSpy.registerUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '0681470311',
      password: 'password123',
    });

    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Utilisateur enregistré avec succès',
      'Fermer',
      { duration: 5000, verticalPosition: 'top', horizontalPosition: 'center' }
    );
  });

  it('should handle user registration failure', () => {
    component.signupForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '0681470311',
      password: 'password123',
      confirmPassword: 'password123',
    });

    userServiceSpy.registerUser.and.returnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.handleSubmit();
    fixture.detectChanges(); // Ajout pour détecter les changements

    expect(userServiceSpy.registerUser).toHaveBeenCalled();
    expect(component.SignUpError).toBeTrue();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.passwordVisible).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.passwordVisible).toBeFalse();
  });

  it('should toggle confirm password visibility', () => {
    expect(component.confirmPasswordVisible).toBeFalse();
    component.toggleConfirmPasswordVisibility();
    expect(component.confirmPasswordVisible).toBeTrue();
    component.toggleConfirmPasswordVisibility();
    expect(component.confirmPasswordVisible).toBeFalse();
  });
});
