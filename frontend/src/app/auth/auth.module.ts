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
import { GoogleLoginComponent } from './google/google-login.component';
import { LoginGuard } from './login-guard.service';

@NgModule({
  declarations: [LoginFormComponent, GoogleLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbTabsModule,
    MdbValidationModule,
    RouterModule.forChild([
      {path: '', component: LoginFormComponent, canActivate: [LoginGuard]},
      {path: 'auth/google/login/:accessToken/:refreshToken', component: GoogleLoginComponent},
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LoginGuard
  ]
})
export class AuthModule { }
