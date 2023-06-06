import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserLogin} from "../share/model/auth/user-login.model";
import * as AppConstant from "../app.constant";
import {AlertService} from "../share/services/alert.service";
import {AuthResponseData} from "../share/model/auth/auth-reponse-data.model";
import {UserLoginLocalStorage} from "../share/model/auth/user-login-local-storage.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private _authUrl = `${AppConstant.APP_SERVER_API_URL}/auth`;
  userLogged = new BehaviorSubject<UserLogin>(null);

  private _refreshTokenExpirationTimer: any;
  private _tokenExpirationTimer: any;
  private _jwtHelperService = new JwtHelperService();


  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _alertService: AlertService,
  ) {
  }

  login(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        `${this._authUrl}/login`,
        {
          emailOrUsername: email,
          password: password,
        }
      )
      .pipe(
        tap(resData => {
          this.handleAuthentication(
            resData['access_token'],
            +resData['expires_in'],
            resData['refresh_token'],
            +resData['refresh_expires_in'],
          );
        })
      );
  }

  autoLogin() {
    const userData: UserLoginLocalStorage = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) {
      return;
    }

    const loadedUser = new UserLogin(
      userData.preferred_username,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData._refreshToken,
      new Date(userData._refreshTokenExpirationDate)
    );

    if (loadedUser.token) {
      this.userLogged.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      const refreshExpirationDuration = new Date(userData._refreshTokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(refreshExpirationDuration, expirationDuration, (loadedUser.refreshToken || ''))
    }
  }

  refreshToken(refreshToken: string) {
    return this._http
      .get<AuthResponseData>(
        `${this._authUrl}/refreshToken/${refreshToken}`
      )
      .pipe(
        tap(resData => {
          const userData: {
            _refreshTokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData')!);

          const refreshExpirationDuration = new Date(userData._refreshTokenExpirationDate).getTime() - new Date().getTime();

          this.autoLogout(refreshExpirationDuration, +resData['expires_in'] * 1000, resData['refresh_token']);

          this.handleAuthentication(
            resData['access_token'],
            +resData['expires_in'],
            resData['refresh_token'],
            +resData['refresh_expires_in'],
          );
        })
      );
  }

  logout() {
    this.userLogged.next(null);
    this._router.navigate(['/auth']).then(() => {
      localStorage.removeItem('userData');
      this.clearLogoutTime();
    });
  }

  autoLogout(refreshExpirationDuration: number, tokenExpirationDuration: number, refreshToken: string) {
    this._refreshTokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, refreshExpirationDuration);
    clearTimeout(this._tokenExpirationTimer)
    this._tokenExpirationTimer = this.setGetAccessTokenTimer(refreshToken, tokenExpirationDuration)
  }

  handleAuthentication = (
    token: string,
    expiresIn: number,
    refreshToken: string,
    refreshExpiresIn: number,
  ) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const refreshExpirationDate = new Date(new Date().getTime() + refreshExpiresIn * 1000);
    let userDecodeFromToken: UserLogin = this._jwtHelperService.decodeToken(token);
    const user = new UserLogin(userDecodeFromToken.preferred_username, userDecodeFromToken.email, token, expirationDate, refreshToken, refreshExpirationDate);
    this.userLogged.next(user);
    this.autoLogout(refreshExpiresIn * 1000, expiresIn * 1000, refreshToken)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  setGetAccessTokenTimer(refreshTokenString: string, expirationDuration: number) {
    return setTimeout(() => {
      // call get access token
      this.refreshToken(refreshTokenString).subscribe({
        next: () => {},
        error: (err) => this._alertService.handleErrors(err),
      });
      this._tokenExpirationTimer = this.setGetAccessTokenTimer(refreshTokenString, expirationDuration);
    }, expirationDuration)
  }

  clearLogoutTime() {
    if (this._refreshTokenExpirationTimer) {
      clearTimeout(this._refreshTokenExpirationTimer);
      clearTimeout(this._tokenExpirationTimer);
      this._refreshTokenExpirationTimer = null;
      this._tokenExpirationTimer = null;
    }
  }
}
