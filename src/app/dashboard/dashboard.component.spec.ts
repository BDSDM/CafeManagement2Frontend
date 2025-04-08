import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mocks pour les services
class MockAuthService {
  getStoredUserName() {
    return 'John Doe';
  }

  getStoredBoolean() {
    return true;
  }

  logOut() {
    // Simule la déconnexion
  }
}

class MockRouter {
  navigate(path: string[]) {
    // Simule la navigation
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        MatToolbarModule, // Ajout du module MatToolbar
        MatSidenavModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize username and showPopup on ngOnInit', () => {
    component.ngOnInit();
    expect(component.username).toBe('John Doe');
    expect(component.showPopup).toBe(true);
  });

  it('should call logOut when logOut is called', () => {
    spyOn(mockAuthService, 'logOut');
    component.logOut();
    expect(mockAuthService.logOut).toHaveBeenCalled();
  });

  it('should navigate to /usermanagement when goToUsersManagement is called', () => {
    spyOn(mockRouter, 'navigate');
    component.goToUsersManagement();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/usermanagement']);
  });

  it('should navigate to /todolist when goToToDoList is called', () => {
    spyOn(mockRouter, 'navigate');
    component.goToToDoList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/todolist']);
  });

  it('should navigate to /cookiesgame when goToCookiesGame is called', () => {
    spyOn(mockRouter, 'navigate');
    component.goToCookiesGame();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cookiesgame']);
  });

  it('should close the popup and save it in localStorage when closePopup is called', () => {
    spyOn(localStorage, 'setItem');
    component.closePopup();
    expect(component.showPopup).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'showPopup',
      JSON.stringify(false)
    );
  });
});
