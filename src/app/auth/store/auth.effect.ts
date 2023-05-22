import * as fromAuth from "./auth.action";
import {Auth, Login, User} from "../user.model";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

export interface AuthResponseData {
  email: string;
  userId: string;
  'access_token': string;
  'refresh_token': string;
  'expires_in': string;
  'refresh_expires_in': string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string,
  refreshToken: string,
  refreshExpiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const refreshExpirationDate = new Date(new Date().getTime() + refreshExpiresIn * 1000);
  const user = new User(email, userId, token, expirationDate, refreshToken, refreshExpirationDate)
  localStorage.setItem('userData', JSON.stringify(user))
  return fromAuth.authenticateSuccess(
    {
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate,
      refreshToken: refreshToken,
      refreshExpirationDate: refreshExpirationDate,
      redirect: true,
    }
  );
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  console.log(errorRes)
  if (!errorRes.error || !errorRes.error.error) {
    console.log("aasvsf")
    return of(fromAuth.authenticateFail({payload: errorMessage}))
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(fromAuth.authenticateFail({payload: errorMessage}));
}

@Injectable()
export class AuthEffects {
  private signUpUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD8ozMP6GFw-NNBaUowKZ5n63FB7lWVfg4';
  private signInUrl: string = 'http://localhost:8888/auth/login';
  private refreshTokenUrl: string = 'http://localhost:8888/user/refreshToken/';


  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  // authSignup = createEffect(() => this.actions$.pipe(
  //   ofType(SIGNUP_START),
  //   switchMap((signupAction: Login) => {
  //       return this.http
  //         .post<AuthResponseData>(
  //           this.signUpUrl,
  //           {
  //             email: signupAction.email,
  //             password: signupAction.password,
  //             returnSecureToken: true
  //           }
  //         ).pipe(
  //           tap(resData => {
  //             this.authService.setLogoutTimer(+resData['expires_in'] * 1000)
  //           }),
  //           map(resData => {
  //             return handleAuthentication(
  //               +resData['expires_in'],
  //               '',
  //               '',
  //               resData['access_token']
  //             )
  //           }),
  //           catchError(errorRes => {
  //             return handleError(errorRes)
  //           }),
  //         )
  //     }
  //   )
  // ))

  authLogin = createEffect(() => this.actions$.pipe(
      ofType(fromAuth.LOGIN_START),
      switchMap((authData: Login) => {
        return this.http
          .post<AuthResponseData>(
            this.signInUrl,
            {
              username: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          ).pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData['refresh_expires_in'] * 1000,
                +resData['expires_in'] * 1000, resData['refresh_token'])
            }),
            map(resData => {
              console.log(resData)
              return handleAuthentication(
                +resData['expires_in'],
                resData.email,
                resData.userId,
                resData['access_token'],
                resData['refresh_token'],
                +resData['refresh_expires_in'],
              )
            }),
            catchError(errorRes => {
              return handleError(errorRes)
            }),
          )
      }),
    )
  )

  authRedirect = createEffect(() => this.actions$.pipe(
      ofType(fromAuth.AUTHENTICATE_SUCCESS, fromAuth.LOGOUT),
      tap((authSuccessAction: Auth) => {
        if (authSuccessAction.redirect) {
          this.router.navigate(['/'])
        }
      })
    )
    , {dispatch: false})

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(fromAuth.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTime()
      localStorage.removeItem('userData')
      console.log("remove userData")
      this.router.navigate(['/auth'])
    })
  ), {dispatch: false})

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAuth.AUTO_LOGIN),
      map(() => {
          const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            _refreshToken: string;
            _refreshTokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData')!);

          if (!userData) {
            return fromAuth.clearAuthenticate();
          }

          const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate),
            userData._refreshToken,
            new Date(userData._refreshTokenExpirationDate)
          );

          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          const refreshExpirationDuration = new Date(userData._refreshTokenExpirationDate).getTime() - new Date().getTime();

          console.log("expirationDuration: ", userData._tokenExpirationDate)
          this.authService.setLogoutTimer(expirationDuration, refreshExpirationDuration, (loadedUser.refreshToken || ''))
          return fromAuth.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            refreshToken: loadedUser.refreshToken,
            refreshExpirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          })
        }
      )
    );
  });

  refreshToken = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromAuth.REFRESH_TOKEN),
      switchMap((payload: { refreshToken: string }) => {
        return this.http.get<AuthResponseData>(this.refreshTokenUrl + payload.refreshToken)
          .pipe(
            tap(resData => {

              const userData: {
                _refreshTokenExpirationDate: string;
              } = JSON.parse(localStorage.getItem('userData')!);

              const refreshExpirationDuration = new Date(userData._refreshTokenExpirationDate).getTime() - new Date().getTime();

              this.authService.setLogoutTimer(refreshExpirationDuration,
                +resData['expires_in'] * 1000, resData['refresh_token'])
            }),
            map(resData => {
              console.log(resData)
              return handleAuthentication(
                +resData['expires_in'],
                resData.email,
                resData.userId,
                resData['access_token'],
                resData['refresh_token'],
                +resData['refresh_expires_in'],
              )
            }),
            catchError(errorRes => {
              return handleError(errorRes)
            }),
          )
      })
    )
  });

}
