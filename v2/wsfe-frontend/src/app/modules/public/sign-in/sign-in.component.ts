import { angelAnimations } from '@angel/animations';
import { AngelAlertType } from '@angel/components/alert';
import { AngelMediaWatcherService } from '@angel/services/media-watcher';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppData, appData } from 'app/core/app/app.data';
import { AppInitialData, MessageAPI } from 'app/core/app/app.type';
import { AuthService } from 'app/core/auth/auth.service';
import { resetInactive } from 'app/store/global/global.actions';
import { environment } from 'environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: angelAnimations,
})
export class SignInComponent implements OnInit {
  launchingDate = environment.launchingDate;
  oldSite = environment.oldSite;
  isScreenSmall: boolean = false;

  _app_data: AppData = appData;

  alert: { type: AngelAlertType; message: string } = {
    type: 'info',
    message: '',
  };
  signInForm!: FormGroup;
  showAlert: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

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
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _store: Store<{ global: AppInitialData }>,
    private _angelMediaWatcherService: AngelMediaWatcherService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.signInForm = this._formBuilder.group({
      recaptcha: ['', Validators.required],
      buyer_identifier_voucher: ['', [Validators.required]],
      rememberMeVisitor: [''],
    });

    /**
     * Subscribe to media changes
     */
    this._angelMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        /**
         * Check if the screen is small
         */
        this.isScreenSmall = !matchingAliases.includes('md');
      });

    // Subscribe to user changes of state
    this._store.pipe(takeUntil(this._unsubscribeAll)).subscribe((state) => {
      if (
        state.global.appConfig.scheme == 'dark' ||
        state.global.appConfig.scheme == 'light'
      ) {
        this.theme = state.global.appConfig.scheme;
      }
      if (state.global.rememberMeVisitor.enabled) {
        this.signInForm.patchValue({
          rememberMeVisitor: state.global.rememberMeVisitor.enabled,
          buyer_identifier_voucher:
            state.global.rememberMeVisitor.buyer_identifier_voucher,
        });
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
   * Sign in
   */
  signIn(): void {
    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService
      .signInWithBuyerIdentifierVoucher(this.signInForm.value)
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
          this.signInForm.enable();

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
  /**
   * redirect
   * @param url
   * @param target
   * @returns
   */
  redirect(url: string, target = '_blank'): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        resolve(!!window.open(url, target));
      } catch (e) {
        reject(e);
      }
    });
  }
}
