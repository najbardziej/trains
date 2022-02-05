import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { User } from '../../model/user';
import { AuthService } from '../auth.service';

function MustMatch(controlName: string, controlName2: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[controlName2];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      control.setErrors({ mustMatch: true });
      matchingControl.setErrors({ mustMatch: true });
    } else {
      control.setErrors(null);
      matchingControl.setErrors(null);
    }
  }
}

@Component({
  selector: 'trains-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  user: User = {};
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  loginErrorMessage: string = '';
  registerErrorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.registerForm = this.formBuilder.group({
      username:        ['', [Validators.required, Validators.minLength(3)]],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword:  ['', [Validators.required, Validators.minLength(8)]],
      agreeToTerms:    [false]
    }, {
      validator: MustMatch('password', 'repeatPassword')
    });
  }

  checkFormCompletion(form: FormGroup): string {
    for (const control of Object.values(form.controls)) {
      if (!control.dirty) {
        return 'Please fill out the form';
      }
    }
    if (!form.valid) {
      return 'Please fix validation errors';
    }
    if (form == this.registerForm){
      if (!this.registerForm.get('agreeToTerms')?.value)
        return 'You have to agree to the terms';
    }
    return '';
  }

  login(): void {
    this.loginErrorMessage = this.checkFormCompletion(this.loginForm);
    if (this.loginErrorMessage) {
      return;
    }

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => this.onComplete(),
        error: err => {
          this.loginErrorMessage = err.message;
          this.loginForm.get('password')?.reset();
        }
      })
  }

  register(): void {
    this.registerErrorMessage = this.checkFormCompletion(this.registerForm);
    if (this.registerErrorMessage) {
      return;
    }
    
    const {repeatPassword, agreeToTerms, ...user} = this.registerForm.value;

    this.authService.register(user)
      .subscribe({
        next: () => this.onComplete(),
        error: err => {
          this.registerErrorMessage = err.message;
          this.registerForm.get('password')?.reset();
          this.registerForm.get('repeatPassword')?.reset();
        }
      })
  }

  onComplete(): void {
    this.loginForm.reset();
    this.registerForm.reset();
    this.router.navigate(['/games']);
  }

  async googleLogin(): Promise<void> {

    let token;
    await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(googleToken => {
        token = googleToken;
      })
      .catch(err => {
        this.registerErrorMessage = err.message;
      })
    
    if (token){
      this.authService.googleLogin(token['authToken'])
        .subscribe({
          next: () => this.onComplete(),
          error: err => {
            this.registerErrorMessage = err.message;
          }
        })
    } else {
      this.registerErrorMessage = "Unknown OAuth error occurred";
    }
  }
}
