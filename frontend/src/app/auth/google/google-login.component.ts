import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Token } from '../../model/token';

@Component({
  selector: 'trains-google-login',
  template: ``,
  styles: [
  ]
})
export class GoogleLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const token: Token = {
      accessToken: routeParams.get('accessToken')!,
      refreshToken: routeParams.get('refreshToken')!
    }
    this.authService.loginViaToken(token)
      .subscribe({
        next: () => {
          this.router.navigate(['games']);
        }
      })
    this.router.navigate([''])
  }
}
