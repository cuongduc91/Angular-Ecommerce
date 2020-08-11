import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocialAuthService } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public auth: false;
  private SERVER_URL = environment.serverUrl;
  private user;
  constructor(
    private authService: SocialAuthService,
    private httpClient: HttpClient
  ) {}
}

export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
}
