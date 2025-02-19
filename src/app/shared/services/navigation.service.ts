import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  previousUrl: Observable<any> = new Subject();

  constructor(private router: Router) {}

  goToDashboardPage() {
    this.router.navigate(['dashboard']).then();
  }

  goToTargetPage(url: string) {
    this.router.navigate([url]).then();
  }

  goToPreviousPage() {
    this.previousUrl.subscribe((res: string) => {
      this.router.navigate([res]).then();
    });
  }

  goToProfilePage() {
    this.router.navigate(['/user/profile']).then();
  }

  goToSignInPage() {
    this.router.navigateByUrl('login').then();
  }

  goToErrorPage() {
    this.router.navigateByUrl('internal-error').then();
  }
}
