import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  private oAuthClient: Auth.OAuth2Client;
  constructor() {
    this.oAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET
    );
  }

  async validateToken(token: string) {
    return await this.oAuthClient.getTokenInfo(token);
  }
}