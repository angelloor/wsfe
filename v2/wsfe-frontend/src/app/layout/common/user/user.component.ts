import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppInitialData } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { LayoutService } from 'app/layout/layout.service';
import { TYPE_PROFILE } from 'app/modules/core/profile/profile.types';
import { user } from 'app/modules/core/user/user.data';
import { User } from 'app/modules/core/user/user.types';
import { environment } from 'environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { SettingsCompanyService } from '../settings-company/settings-company.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'user',
})
export class UserComponent implements OnInit, OnDestroy {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_showAvatar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */
  _urlPathAvatar: string = environment.urlBackend + '/resource/img/avatar/';

  @Input() showAvatar: boolean = true;
  user: User = user;

  sign_in_visitor: boolean = false;
  /**
   * TYPE_PROFILE
   */
  type_profile: TYPE_PROFILE = 'commonProfile';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private store: Store<{ global: AppInitialData }>,
    private _router: Router,
    private _settingsCompanyService: SettingsCompanyService,
    private _layoutService: LayoutService,
    private _authService: AuthService
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
      this.sign_in_visitor = state.global.sign_in_visitor;
      this.user = state.global.user;
      this.type_profile = this.user.type_user.profile.type_profile;
      /**
       * checkSession
       */
      if (this.sign_in_visitor) {
        this._authService
          .checkSessionVisitor()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe();
      } else {
        this._authService
          .checkSession()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe();
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update the user status
   *
   * @param status
   */
  updateUserStatus(status: string): void {
    // Return if user is not available
    if (!this.user) {
      return;
    }

    // // Update the user
    // this._userService
    //   .update({
    //     ...this.user,
    //     status,
    //   })
    //   .subscribe();
  }
  /**
   * openSettingsCompany
   */
  openSettingsCompany(): void {
    this._settingsCompanyService
      .openSettingsCompany(this.user.company.id_company)
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._layoutService.setOpenModal(false);
      });
  }
  /**
   * Sign out
   */
  signOut(): void {
    this._router.navigate(['auth/sign-out']);
  }
  goToHome(): void {
    this._router.navigate(['business']);
  }
}
