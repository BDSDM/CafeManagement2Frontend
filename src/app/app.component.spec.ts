import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivityService } from './services/activity.service';
import { CheckActivityService } from './services/check-activity.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let checkActivityService: CheckActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [AppComponent],
      providers: [ActivityService, CheckActivityService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    checkActivityService = TestBed.inject(CheckActivityService);
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir le titre "cafeManagement2Frontend"', () => {
    expect(component.title).toEqual('cafeManagement2Frontend');
  });

  it('devrait appeler startChecking de CheckActivityService lors de ngOnInit', () => {
    spyOn(checkActivityService, 'startChecking');
    fixture.detectChanges(); // Déclenche ngOnInit
    expect(checkActivityService.startChecking).toHaveBeenCalled();
  });
});
