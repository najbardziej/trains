import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'trains-google-login',
  template: ``,
  styles: [
  ]
})
export class GoogleLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    // this.authService.googleLogin()
    //   .subscribe({
    //     next: (obj) => console.log(obj),
    //     error: (err) => console.log(err)
    //   })
  }

}
