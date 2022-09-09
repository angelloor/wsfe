import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppData, appData } from 'app/core/app/app.data';
import { AppInitialData } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, timer } from 'rxjs';
import { finalize, takeUntil, takeWhile, tap } from 'rxjs/operators';

@Component({
  selector: 'auth-sign-out',
  templateUrl: './sign-out.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignOutComponent implements OnInit, OnDestroy {
  countdown: number = 5;
  countdownMapping: any = {
    '=1': '# segundo',
    other: '# segundos',
  };

  _app_data: AppData = appData;
  routeToRedirect: string = 'auth/sign-in';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private store: Store<{ global: AppInitialData }>,
    private _authService: AuthService,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to user changes of state
    this.store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      if (state.global.sign_in_visitor) {
        this.routeToRedirect = 'public/sign-in';
      }
    });

    // Sign out
    this._authService.signOut().subscribe();
    // Redirect after the countdown
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this._router.navigate([this.routeToRedirect]);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--)
      )
      .subscribe();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(0);
    this._unsubscribeAll.complete();
  }
}
