import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateComponent } from './update.component';
import { UserService } from '../services/user.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UpdateComponent>>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['updateUser']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [UpdateComponent],
      imports: [
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              contactNumber: '0681470316',
              status: 'Active',
              role: 'Admin',
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ensure initial form values
  });

  it('should initialize the form with correct values', () => {
    expect(component.updateForm.value).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      contactNumber: '0681470316',
      status: 'Active',
      role: 'Admin',
    });
  });

  it('should call userService.updateUser when form is valid', async () => {
    const user = {
      id: 1,
      name: 'Updated User',
      email: 'updated@example.com',
      contactNumber: '0681470311',
      status: 'Inactive',
      role: 'User',
    };

    // Initialiser les valeurs du formulaire
    component.updateForm.controls['name'].setValue(user.name);
    component.updateForm.controls['email'].setValue(user.email);
    component.updateForm.controls['contactNumber'].setValue(user.contactNumber);
    component.updateForm.controls['status'].setValue(user.status);
    component.updateForm.controls['role'].setValue(user.role);

    fixture.detectChanges();

    // Vérifier que le formulaire est bien valide
    expect(component.updateForm.valid).toBeTrue();

    // Simuler la réponse du service
    userServiceSpy.updateUser.and.returnValue(of(user));

    // Appeler handleUpdate
    component.handleUpdate();
    await fixture.whenStable();

    // Vérifier que updateUser a été appelé avec les bons arguments
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(user.id, {
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      status: user.status,
      role: user.role,
    });
  });

  it('should handle error when userService.updateUser fails', async () => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'updated@example.com',
      contactNumber: '0681470311',
      status: 'Inactive',
      role: 'User',
    };

    // Set form values
    component.updateForm.setValue(updatedUserData);

    // Simulate an error from the updateUser service
    userServiceSpy.updateUser.and.returnValue(
      throwError(() => new Error('Error'))
    );

    // Trigger the form submission
    component.handleUpdate();
    await fixture.whenStable();

    // Ensure updateUser was called
    expect(userServiceSpy.updateUser).toHaveBeenCalled();

    // Ensure snack bar is opened with the error message
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      "Échec de la mise à jour de l'utilisateur",
      'Fermer',
      { duration: 5000, verticalPosition: 'top', horizontalPosition: 'center' }
    );
  });
});
