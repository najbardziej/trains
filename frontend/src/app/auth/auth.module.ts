import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MdbModule, MdbFormsModule, MdbTabsModule, MdbValidationModule } from 'mdb-angular-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { GoogleLoginComponent } from './google/google-login.component';

@NgModule({
  declarations: [LoginFormComponent, GoogleLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdbModule,
    MdbFormsModule,
    MdbTabsModule,
    MdbValidationModule,
    RouterModule.forChild([
      {path: '', component: LoginFormComponent},
      {path: 'auth/google/login', component: GoogleLoginComponent},
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AuthModule { }
