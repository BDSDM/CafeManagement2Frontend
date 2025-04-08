import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmLogoutDialogComponent } from './confirm-logout-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // ✅ Import de MatIconModule

describe('ConfirmLogoutDialogComponent', () => {
  let component: ConfirmLogoutDialogComponent;
  let fixture: ComponentFixture<ConfirmLogoutDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmLogoutDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']); // Mock de MatDialogRef

    await TestBed.configureTestingModule({
      declarations: [ConfirmLogoutDialogComponent],
      imports: [MatIconModule], // ✅ Ajout du module MatIconModule
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLogoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when confirm() is called', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancel() is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
