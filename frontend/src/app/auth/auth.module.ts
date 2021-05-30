import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { MdbModule, MdbFormsModule, MdbTabsModule, MdbValidationModule } from 'mdb-angular-ui-kit';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdbModule,
    MdbFormsModule,
    MdbTabsModule,
    MdbValidationModule,
    RouterModule.forChild([
      {path: '', component: LoginFormComponent},
    ])
  ]
})
export class AuthModule { }
