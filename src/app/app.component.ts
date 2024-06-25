import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SBS Sound';
  constructor(private analytics: AngularFireAnalytics) {
    this.logEvent();
    const app = initializeApp(environment.firebase);
    //const perf = getPerformance(app);

  }
  logEvent() {
    this.analytics.logEvent('page_view', { page_title: 'Home Page' });
  }
}
