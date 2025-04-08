import {
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { CheckActivityService } from './check-activity.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

describe('CheckActivityService', () => {
  let checkActivityService: CheckActivityService;
  let authService: any;
  let userService: any;
  let jwtHelper: any;

  beforeEach(() => {
    authService = {
      getToken: jasmine.createSpy('getToken'),
    };

    userService = {
      logoutFromApp: jasmine.createSpy('logoutFromApp'),
    };

    jwtHelper = {
      isTokenExpired: jasmine.createSpy('isTokenExpired'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        CheckActivityService,
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
        { provide: JwtHelperService, useValue: jwtHelper },
      ],
    });

    checkActivityService = TestBed.inject(CheckActivityService);
  });

  afterEach(() => {
    userService.logoutFromApp.calls.reset();
    authService.getToken.calls.reset();
    jwtHelper.isTokenExpired.calls.reset();
  });

  it('should be created', () => {
    expect(checkActivityService).toBeTruthy();
  });

  it('should not call logoutFromApp if token is valid', fakeAsync(() => {
    const validToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    authService.getToken.and.returnValue(validToken);
    jwtHelper.isTokenExpired.and.returnValue(Promise.resolve(false));

    checkActivityService.startChecking();
    tick(10000);

    expect(userService.logoutFromApp).not.toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should call logoutFromApp if token is expired', fakeAsync(() => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.dummyexpiredtoken';

    authService.getToken.and.returnValue(expiredToken);
    jwtHelper.isTokenExpired.and.returnValue(Promise.resolve(true));

    checkActivityService.startChecking();
    tick(10000);

    expect(userService.logoutFromApp).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should not call logoutFromApp if token is null', fakeAsync(() => {
    authService.getToken.and.returnValue(null);

    checkActivityService.startChecking();
    tick(10000);

    expect(userService.logoutFromApp).not.toHaveBeenCalled();
    discardPeriodicTasks();
  }));
});
