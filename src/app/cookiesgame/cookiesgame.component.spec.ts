import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesgameComponent } from './cookiesgame.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CookiesgameComponent', () => {
  let component: CookiesgameComponent;
  let fixture: ComponentFixture<CookiesgameComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Création des spies pour les services
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'setColorPreference',
      'getColorPreference',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getStoredUserName',
      'logOut',
    ]);

    // Configuration du test
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatSidenavModule,
        NoopAnimationsModule,
      ], // Utilisation de RouterTestingModule pour simuler la navigation
      declarations: [CookiesgameComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CookiesgameComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadColorPreference on ngOnInit', () => {
    spyOn(component, 'loadColorPreference');
    component.ngOnInit();
    expect(component.loadColorPreference).toHaveBeenCalled();
  });

  it('should set the current color when setColor is called successfully', () => {
    const newColor = 'red';
    userServiceSpy.setColorPreference.and.returnValue(of({}));
    component.setColor(newColor);
    expect(component.currentColor).toBe(newColor);
    expect(userServiceSpy.setColorPreference).toHaveBeenCalledWith(newColor);
  });

  it('should handle error when setting color', () => {
    const newColor = 'green';
    const errorResponse = 'Error setting color';
    spyOn(console, 'error'); // Espionner la méthode console.error
    userServiceSpy.setColorPreference.and.returnValue(
      throwError(() => new Error(errorResponse))
    );
    component.setColor(newColor);
    expect(component.currentColor).toBe('white');
    expect(userServiceSpy.setColorPreference).toHaveBeenCalledWith(newColor);
    expect(console.error).toHaveBeenCalledWith(
      'Erreur lors de la définition de la couleur:',
      jasmine.any(Error)
    );
  });

  it('should load color preference on ngOnInit', () => {
    const savedColor = 'blue';
    userServiceSpy.getColorPreference.and.returnValue(of(savedColor));
    component.ngOnInit();
    expect(component.currentColor).toBe(savedColor);
    expect(userServiceSpy.getColorPreference).toHaveBeenCalled();
  });

  it('should set default color if error occurs while loading preference', () => {
    userServiceSpy.getColorPreference.and.returnValue(
      throwError(() => new Error('Error fetching color'))
    );
    component.ngOnInit();
    expect(component.currentColor).toBe('white');
    expect(userServiceSpy.getColorPreference).toHaveBeenCalled();
  });

  it('should logout user when logout is called', () => {
    component.logout();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
  });

  it('should navigate to todo list when goToToDoList is called', () => {
    component.goToToDoList();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todolist']);
  });

  it('should navigate to user management and show popup when goToUsersManagement is called', () => {
    component.goToUsersManagement();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/usermanagement']);
    expect(localStorage.getItem('showPopup')).toBe('true');
  });

  it('should navigate to dashboard and hide popup when goToDashboard is called', () => {
    component.goToDashboard();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(localStorage.getItem('showPopup')).toBe('false');
  });

  it('should load color preference on ngOnInit', () => {
    const savedColor = 'blue';

    // Simuler le retour d'un observable valide pour getColorPreference
    userServiceSpy.getColorPreference.and.returnValue(of(savedColor));

    // Appel de ngOnInit pour tester le comportement
    component.ngOnInit();

    // Vérification que la couleur actuelle est bien celle renvoyée par le service
    expect(component.currentColor).toBe(savedColor);

    // Vérification que getColorPreference a été appelé
    expect(userServiceSpy.getColorPreference).toHaveBeenCalled();
  });
});
