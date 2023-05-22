import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {logout, refreshToken} from "./store/auth.action";
import {map} from "rxjs";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private refreshTokenExpirationTimer: any;
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(refreshExpirationDuration: number, tokenExpirationDuration: number, refreshToken: string) {
    this.refreshTokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout())
    }, refreshExpirationDuration);
    clearTimeout(this.tokenExpirationTimer)
    this.tokenExpirationTimer = this.setGetAccessTokenTimer(refreshToken, tokenExpirationDuration)
  }

  setGetAccessTokenTimer(refreshTokenString: string, expirationDuration: number) {
    return  setTimeout(() => {
      // call get access token
      console.log("call refresh token")
      this.store.dispatch(refreshToken({refreshToken: refreshTokenString}));
      this.tokenExpirationTimer = this.setGetAccessTokenTimer(refreshTokenString, expirationDuration);
    }, expirationDuration)
  }

  clearLogoutTime() {
    if(this.refreshTokenExpirationTimer) {
      clearTimeout(this.refreshTokenExpirationTimer);
      clearTimeout(this.tokenExpirationTimer);
      this.refreshTokenExpirationTimer = null;
      this.tokenExpirationTimer = null;
    }
  }

  isAuthenticated() {
    let isAuthenticated = false;
    this.store.select('auth')
      .pipe(map(authState => authState.auth))
      .subscribe(user => {
        isAuthenticated = !!user
      })

    return isAuthenticated
  }

}
