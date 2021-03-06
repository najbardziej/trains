import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoginGuard } from './login-guard.service';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { GoogleLoginComponent } from './login-form/google/google-login.component';

@NgModule({
  declarations: [LoginFormComponent, GoogleLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbTabsModule,
    SocialLoginModule,
    MdbValidationModule,
    RouterModule.forChild([
      { path: '', component: LoginFormComponent, canActivate: [LoginGuard] },
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientID)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    LoginGuard
  ]
})
export class AuthModule { }
