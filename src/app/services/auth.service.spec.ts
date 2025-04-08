import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmLogoutDialogComponent } from '../confirm-logout-dialog/confirm-logout-dialog.component';
import { UserService } from './user.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: jasmine.SpyObj<Router>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    userServiceMock = jasmine.createSpyObj('UserService', ['logoutFromApp']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login and return a token', () => {
      const credentials = { email: 'test@test.com', password: 'password123' };
      const token = 'fake-jwt-token';

      service.login(credentials).subscribe((response) => {
        expect(response).toBe(token);
      });

      const req = httpMock.expectOne('http://localhost:8080/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(token);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if there is a token', () => {
      localStorage.setItem('token', 'fake-jwt-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if there is no token', () => {
      localStorage.removeItem('token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getStoredUserId', () => {
    it('should return the user ID from localStorage', () => {
      localStorage.setItem('id', '123');
      expect(service.getStoredUserId()).toBe(123);
    });

    it('should return 0 if no user ID is found in localStorage', () => {
      localStorage.removeItem('id');
      expect(service.getStoredUserId()).toBe(0);
    });
  });

  describe('getStoredUserEmail', () => {
    it('should return the stored email', () => {
      localStorage.setItem('sub', 'test@test.com');
      expect(service.getStoredUserEmail()).toBe('test@test.com');
    });

    it('should return null if no email is stored', () => {
      localStorage.removeItem('sub');
      expect(service.getStoredUserEmail()).toBeNull();
    });
  });

  describe('getStoredBoolean', () => {
    it('should return the stored boolean', () => {
      localStorage.setItem('showPopup', 'true');
      expect(service.getStoredBoolean()).toBeTrue();
    });

    it('should return false if no boolean is stored', () => {
      localStorage.removeItem('showPopup');
      expect(service.getStoredBoolean()).toBeFalse();
    });
  });

  describe('getStoredUserName', () => {
    it('should return the stored user name', () => {
      localStorage.setItem('name', 'John Doe');
      expect(service.getStoredUserName()).toBe('John Doe');
    });

    it('should return an empty string if no user name is stored', () => {
      localStorage.removeItem('name');
      expect(service.getStoredUserName()).toBe('');
    });
  });

  describe('getStoredUserRole', () => {
    it('should return the stored user role', () => {
      localStorage.setItem('role', 'admin');
      expect(service.getStoredUserRole()).toBe('admin');
    });

    it('should return an empty string if no user role is stored', () => {
      localStorage.removeItem('role');
      expect(service.getStoredUserRole()).toBe('');
    });
  });

  describe('checkActivity', () => {
    it('should log out if the JWT is expired', () => {
      // JWT expiré : il y a 1 heure
      const expiredJwt = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const base64Payload = btoa(JSON.stringify(expiredJwt));
      const token = `header.${base64Payload}.signature`;

      localStorage.setItem('token', token);
      spyOn(window, 'atob').and.callFake(() => JSON.stringify(expiredJwt));

      service.checkActivity();

      expect(userServiceMock.logoutFromApp).toHaveBeenCalled();
    });

    it('should not log out if the JWT is still valid', () => {
      const validJwt = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const base64Payload = btoa(JSON.stringify(validJwt));
      const token = `header.${base64Payload}.signature`;

      localStorage.setItem('token', token);
      spyOn(window, 'atob').and.callFake(() => JSON.stringify(validJwt));

      service.checkActivity();

      expect(userServiceMock.logoutFromApp).not.toHaveBeenCalled();
    });
  });

  describe('logOut', () => {
    it('should remove the token and navigate to home on logout confirmation', () => {
      localStorage.setItem('token', 'fake-jwt-token');
      const dialogRefMock = { afterClosed: () => of(true) };
      dialogMock.open.and.returnValue(dialogRefMock as any);

      service.logOut();

      expect(localStorage.getItem('token')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should not navigate if logout is canceled', () => {
      localStorage.setItem('token', 'fake-jwt-token');
      const dialogRefMock = { afterClosed: () => of(false) };
      dialogMock.open.and.returnValue(dialogRefMock as any);

      service.logOut();

      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    });
  });
});
