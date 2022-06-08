import { Component, Input } from '@angular/core';

@Component({
  selector: 'google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})

export class GoogleLoginComponent {
  @Input() buttonText = '';
}