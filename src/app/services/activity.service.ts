import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService implements OnDestroy {
  private inactivityTimeout: any;
  private readonly INACTIVITY_DURATION = 1 * 300 * 1000; // 1 minute

  constructor(private userService: UserService) {
    this.startActivityListener();
  }

  /**
   * Réinitialise le timer d'inactivité
   */
  private resetTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.userService.logoutFromApp(); // Déconnexion après inactivité
    }, this.INACTIVITY_DURATION);
  }

  /**
   * Ajoute des écouteurs d'événements pour détecter l'activité utilisateur
   */
  private startActivityListener() {
    this.resetTimer();
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keydown', this.resetTimer.bind(this));
    window.addEventListener('scroll', this.resetTimer.bind(this));
    window.addEventListener('click', this.resetTimer.bind(this));
  }

  /**
   * Nettoie les écouteurs d'événements lorsque le service est détruit
   */
  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.resetTimer.bind(this));
    window.removeEventListener('keydown', this.resetTimer.bind(this));
    window.removeEventListener('scroll', this.resetTimer.bind(this));
    window.removeEventListener('click', this.resetTimer.bind(this));
    clearTimeout(this.inactivityTimeout);
  }
}
