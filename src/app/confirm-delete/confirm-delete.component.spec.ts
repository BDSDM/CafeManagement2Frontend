import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDeleteComponent } from './confirm-delete.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

describe('ConfirmDeleteComponent', () => {
  let component: ConfirmDeleteComponent;
  let fixture: ComponentFixture<ConfirmDeleteComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDeleteComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ConfirmDeleteComponent>>(
      'MatDialogRef',
      ['close']
    );
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmDeleteComponent],
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        MatIconModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when onConfirm is called', () => {
    component.onConfirm();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Utilisateur supprimé avec succès',
      'Fermer',
      jasmine.objectContaining({
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      })
    );
  });

  it('should close the dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
