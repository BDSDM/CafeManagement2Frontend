import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { SigninComponent } from '../signin/signin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [BrowserAnimationsModule], // Nécessaire pour MatDialog
      providers: [{ provide: MatDialog, useValue: dialogMock }],
      schemas: [NO_ERRORS_SCHEMA], // Ignore les erreurs liées aux templates Angular Material
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it("devrait ouvrir la boîte de dialogue d'inscription", () => {
    component.handleSignUpAction();

    // Créer un objet de configuration attendu pour l'inscription
    const expectedConfig = jasmine.objectContaining({
      width: '550px',
      disableClose: true,
      maxWidth: '80vw', // ou toute autre valeur par défaut générée par Angular
      hasBackdrop: true, // autre valeur par défaut
      role: 'dialog', // et ainsi de suite...
    });

    // Vérifier que MatDialog.open a bien été appelé avec le composant et la configuration attendue
    expect(dialogSpy.open).toHaveBeenCalledWith(
      SignupComponent,
      expectedConfig
    );
  });

  it('devrait ouvrir la boîte de dialogue de connexion', () => {
    component.handleSignInAction();

    // Créer un objet de configuration attendu (en tenant compte des valeurs par défaut supplémentaires)
    const expectedConfig = jasmine.objectContaining({
      width: '550px',
      disableClose: true,
      maxWidth: '80vw', // ou toute autre valeur par défaut générée par Angular
      hasBackdrop: true, // autre valeur par défaut
      role: 'dialog', // et ainsi de suite...
    });

    // Vérifier que MatDialog.open a bien été appelé avec le composant et la configuration attendue
    expect(dialogSpy.open).toHaveBeenCalledWith(
      SigninComponent,
      expectedConfig
    );
  });
});
