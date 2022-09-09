import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { AppInitialData } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private routesAllow: string[] = [];

  routeToRedirect: string = 'auth/sign-in';
  /**
   * Constructor
   */
  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _authService: AuthService,
    private _router: Router
  ) {
    this._authService.routes$.pipe().subscribe((routes: string[]) => {
      this.routesAllow = routes;
      // console.log(this.routesAllow);
    });
    this._store.subscribe((state) => {
      if (state.global.sign_in_visitor) {
        this.routeToRedirect = 'public/sign-in';
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Check the authenticated status
   *
   * @param redirectURL
   * @private
   */
  private _check(redirectURL: string): Observable<boolean> {
    // Check the authentication status
    return this._authService.check().pipe(
      switchMap((authenticated) => {
        // If the user is not authenticated...
        if (!authenticated) {
          // Redirect to the sign-in page
          this._router.navigate([this.routeToRedirect], {
            queryParams: { redirectURL },
          });
          // Prevent the access
          return of(false);
        } else {
          if (redirectURL.substring(0, 9) === '/business') {
            let isPermitted = this.routesAllow.find(
              (route) =>
                route === redirectURL ||
                route === redirectURL.substring(0, route.length)
            );

            // console.log(
            //   `${isPermitted ? 'pase' : `Oe Oe Oe no pases -> ${redirectURL}`}`
            // );

            if (isPermitted) {
              return of(true);
            } else {
              // Navigate not found page
              this._router.navigate(['/public/not-found'], {
                queryParams: { redirectURL },
              });
              return of(false);
            }
          }
          // Allow the access
          return of(true);
        }
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Can activate
   *
   * @param route
   * @param state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const redirectUrl = state.url === 'core/auth/sign-out' ? '/' : state.url;
    return this._check(redirectUrl);
  }

  /**
   * Can activate child
   *
   * @param childRoute
   * @param state
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectUrl = state.url === 'auth/sign-out' ? '/' : state.url;
    return this._check(redirectUrl);
  }

  /**
   * Can load
   *
   * @param route
   * @param segments
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check('/');
  }
}
