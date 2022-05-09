import { Component, Input } from '@angular/core';

@Component({
  selector: 'google-login',
  template: `
  <button type="button" class="btn google-signin">
    <img src="https://developers.google.com/identity/images/g-logo.png" >
    <span>{{buttonText}}</span>
  </button>`,
  styles: [
    `.google-signin {
      height: 40px;
      box-sizing: border-box;
      padding: 8px 
    }`,
    `img { 
      height: 24px; 
      width: 24px; 
    }`,
    `span { 
      display: inline-block;
      font-family: Roboto, sans-serif; 
      font-size: 14px; 
      color: #757575; 
      padding: 5px 24px ; 
      line-height: 14px;
    }`,
  ]
})
export class GoogleLoginComponent {
  @Input() buttonText = '';
}