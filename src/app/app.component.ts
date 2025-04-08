import { Component } from '@angular/core';
import { ActivityService } from './services/activity.service';
import { CheckActivityService } from './services/check-activity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cafeManagement2Frontend';

  constructor(
    private activityService: ActivityService,
    private checkActivityService: CheckActivityService //private activityService: ActivityService // Injection du service de détection d'inactivité
  ) {}

  ngOnInit() {
    this.checkActivityService.startChecking();
  }
}
