import { angelAnimations } from '@angel/animations';
import { AngelAlertType } from '@angel/components/alert';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppData, appData } from 'app/core/app/app.data';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { resetInactive } from 'app/store/global/global.actions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'auth-unlock-session',
  templateUrl: './unlock-session.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: angelAnimations,
})
export class AuthUnlockSessionComponent implements OnInit {
  sign_in_visitor: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  _app_data: AppData = appData;

  alert: { type: AngelAlertType; message: string } = {
    type: 'info',
    message: '',
  };
  name_person!: string;
  private name_user!: string;

  showAlert: boolean = false;
  unlockSessionForm!: FormGroup;

  /**
   * Api key del captcha
   * clave del sitio - 6Lcvj6sbAAAAAGAdRNgwJfRK6x1ZJBIsiKMxarE4
   * clave secreta - 6Lcvj6sbAAAAAL1nskNqye0HqnqdeQiF5vgIs5ov
   */

  size: 'compact' | 'normal' = 'normal';
  theme: 'dark' | 'light' = 'light';
  type: 'audio' | 'image' = 'image';
  lang: string = 'es';
  siteKey: string = '6Lcvj6sbAAAAAGAdRNgwJfRK6x1ZJBIsiKMxarE4';
  disabledInput: boolean = true;
  tokenCaptcha: string = '';
  /**
   * Constructor
   */
  constructor(
    private _store: Store<{ global: AppInitialData }>,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    /**
     * Subscribe to user changes of state
     */
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      this.sign_in_visitor = state.global.sign_in_visitor;
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
    // Get the user's name
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      if (this.sign_in_visitor) {
        this.name_person = state.global.user.person.name_person;
        this.name_user = state.global.user.name_user;
      } else {
        this.name_person =
          state.global.user.person.name_person +
          ' ' +
          state.global.user.person.last_name_person;
        this.name_user = state.global.user.name_user;
      }
    });

    // Create the form
    this.unlockSessionForm = this._formBuilder.group({
      name_person: [
        {
          value: this.sign_in_visitor ? this.name_user : this.name_person,
          disabled: true,
        },
      ],
      password: ['', !this.sign_in_visitor ? Validators.required : ''],
      recaptcha: ['', this.sign_in_visitor ? Validators.required : ''],
    });

    // Subscribe to user changes of state
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      if (
        state.global.appConfig.scheme == 'dark' ||
        state.global.appConfig.scheme == 'light'
      ) {
        this.theme = state.global.appConfig.scheme;
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  handleReset() {}
  handleExpire() {}
  handleLoad() {}

  handleSuccess(event: any) {
    this.disabledInput = false;
    this.tokenCaptcha = event;
  }

  /**
   * Unlock
   */
  unlock(): void {
    if (this.sign_in_visitor) {
      // Sign in
      this._authService
        .signInWithBuyerIdentifierVoucher({
          buyer_identifier_voucher:
            this.unlockSessionForm.getRawValue().name_person,
          rememberMeVisitor: true,
        })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: () => {
            const redirectURL =
              this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
              '/signed-in-redirect-public';
            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
            // Set the inactive to false
            this._store.dispatch(resetInactive());
          },
          error: (error: { error: MessageAPI }) => {
            // Re-enable the form
            this.unlockSessionForm.enable();

            // Set the alert
            this.alert = {
              type: 'error',
              message: !error.error
                ? '¡Error interno!, consulte al administrador.'
                : !error.error.description
                ? '¡Error interno!, consulte al administrador.'
                : error.error.description,
            };

            // Show the alert
            this.showAlert = true;
          },
        });
    } else {
      if (this.unlockSessionForm.invalid) {
        return;
      }

      // Disable the form
      this.unlockSessionForm.disable();

      // Hide the alert
      this.showAlert = false;

      this._authService
        .unlockSession({
          name_user: this.name_user ?? '',
          password_user: this.unlockSessionForm.get('password')!.value,
        })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: () => {
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
            const redirectURL =
              this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
              '/signed-in-redirect';

            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
          },
          error: (error: { error: MessageAPI }) => {
            // Re-enable the form
            this.unlockSessionForm.enable();

            // Reset the form
            // this.unlockSessionForm.reset();
            // Patch value
            this.unlockSessionForm.patchValue({
              name_person: this.name_person,
            });
            // Disabled control
            this.unlockSessionForm.get('name_person')!.disable();

            // Set the alert
            this.alert = {
              type: 'error',
              message: !error.error
                ? '¡Error interno!, consulte al administrador.'
                : !error.error.description
                ? '¡Error interno!, consulte al administrador.'
                : error.error.description,
            };

            // Show the alert
            this.showAlert = true;
          },
        });
    }
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
