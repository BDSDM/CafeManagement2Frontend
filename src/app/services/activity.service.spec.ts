import { TestBed } from '@angular/core/testing';
import { ActivityService } from './activity.service';
import { UserService } from './user.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['logoutFromApp']);

    TestBed.configureTestingModule({
      providers: [ActivityService, { provide: UserService, useValue: spy }],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    jasmine.clock().install();
    service = TestBed.inject(ActivityService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call logoutFromApp after inactivity timeout', () => {
    // Simule 60 secondes d'inactivité
    jasmine.clock().tick(30 * 1000); // Tick du délai de 1 minute
    expect(userServiceSpy.logoutFromApp).toHaveBeenCalled();
  });

  it('should reset timer on user activity', () => {
    // Simule une activité utilisateur (reset le timer)
    window.dispatchEvent(new Event('mousemove'));

    // Le timer est reset, donc il ne devrait pas appeler la déconnexion après 59s
    jasmine.clock().tick(59 * 500); // Attendre presque 60s
    expect(userServiceSpy.logoutFromApp).not.toHaveBeenCalled();

    // Simule encore une activité (reset du timer à nouveau)
    window.dispatchEvent(new Event('click'));

    // Attends 59 secondes supplémentaires
    jasmine.clock().tick(59 * 500); // Attendre encore presque 60s
    expect(userServiceSpy.logoutFromApp).not.toHaveBeenCalled();

    // Simule l'écoulement du temps, le timer dépasse 60s et la déconnexion est appelée
    jasmine.clock().tick(2 * 500); // Passe le seuil de 60s
    expect(userServiceSpy.logoutFromApp).toHaveBeenCalled();
  });

  it('should remove event listeners on ngOnDestroy', () => {
    const removeSpy = spyOn(window, 'removeEventListener');

    service.ngOnDestroy();

    expect(removeSpy).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('keydown', jasmine.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('scroll', jasmine.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('click', jasmine.any(Function));
  });
});
