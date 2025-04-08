import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsermanagementComponent } from './usermanagement.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialog,
} from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Ajouté pour matInput
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('UsermanagementComponent', () => {
  let component: UsermanagementComponent;
  let fixture: ComponentFixture<UsermanagementComponent>;
  let userService: UserService;
  let authService: AuthService;
  let dialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsermanagementComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatToolbarModule,
        MatSidenavModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule, // Ajouté pour le formulaire
        MatTableModule,
        MatInputModule, // Ajouté pour matInput
        MatIconModule,
        MatSlideToggleModule,
        MatPaginatorModule,
      ],
      providers: [
        UserService,
        AuthService,
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: true, scrollStrategy: 'block' },
        },
        MatDialog,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsermanagementComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Test de la méthode ngOnInit
  it('should load users and set username on init', () => {
    spyOn(userService, 'getAllUsers').and.returnValue(
      of([
        {
          id: 1,
          name: 'John',
          email: 'john@example.com',
          status: 'true',
          role: 'admin',
          contactNumber: '123-456-7890',
        },
      ])
    );
    spyOn(authService, 'getStoredUserName').and.returnValue('john_doe');

    component.ngOnInit();

    expect(component.username).toBe('john_doe');
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('John');
  });

  // Test de la méthode handleUpdateAction
  it('should open dialog and update user', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      status: 'true',
      role: 'admin',
      contactNumber: '123-456-7890',
    };
    const dialogRef = { afterClosed: () => of(user) };
    spyOn(dialog, 'open').and.returnValue(dialogRef as any);
    spyOn(userService, 'updateUser').and.returnValue(of(user));
    component.users = [user];

    component.handleUpdateAction(user);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.updateUser).toHaveBeenCalledWith(user.id, user);
  });

  // Test de la méthode deleteUser
  it('should delete user after confirmation', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      status: 'true',
      role: 'admin',
      contactNumber: '123-456-7890',
    };
    const dialogRef = { afterClosed: () => of(true) };
    spyOn(dialog, 'open').and.returnValue(dialogRef as any);

    spyOn(userService, 'deleteUser').and.returnValue(of(undefined));

    component.users = [user];

    component.deleteUser(user.id);

    expect(dialog.open).toHaveBeenCalled();
    expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    expect(component.users.length).toBe(0);
  });

  // Test de la méthode applyFilter
  it('should filter users based on input value', () => {
    const event = { target: { value: 'John' } } as any;
    component.users = [
      {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        status: 'true',
        role: 'admin',
        contactNumber: '123-456-7890',
      },
    ];
    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('john');
  });

  // Test de la méthode toggleStatus
  it('should toggle user status', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      status: 'true',
      role: 'admin',
      contactNumber: '123-456-7890',
    };
    spyOn(userService, 'updateUserStatus').and.returnValue(of('false'));

    component.toggleStatus(user);

    expect(userService.updateUserStatus).toHaveBeenCalledWith(
      user.email,
      'false'
    );
    expect(user.status).toBe('false');
  });

  // Test de la méthode goToDashboard
  it('should navigate to dashboard', () => {
    spyOn(router, 'navigate');
    component.goToDashboard();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
