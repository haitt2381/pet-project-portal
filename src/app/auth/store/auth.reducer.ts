import {createReducer, on} from "@ngrx/store";
import {User} from "../user.model";
import * as AuthActions from './auth.action';


export interface State {
  auth: User | null
  authError: string | null
  loading: boolean,
  isAuthenticate: boolean
}

// @ts-ignore
const initialSate: State = {
  auth: null,
  authError: null,
  loading: false,
  isAuthenticate: false,
}

export const authReducer = createReducer(
  initialSate,

  on(AuthActions.loginStart, AuthActions.signupStart, (state) => (
    {
      ...state,
      authError: null,
      loading: true
    }
  )),

  on(AuthActions.authenticateSuccess, (state, payload) => (
    {
      ...state,
      authError: null,
      auth: new User(
        payload.email,
        payload.userId,
        payload.token,
        payload.expirationDate,
        payload.refreshToken,
        payload.refreshExpirationDate
      ),
      loading: false,
      isAuthenticate: true
    }
  )),

  on(AuthActions.authenticateFail, (state, {payload}) => {
      return {
        ...state,
        auth: null,
        authError: payload,
        loading: false,
      }
    }
  ),

  on(AuthActions.logout, (state) => ({
      ...state,
      auth: null,
      isAuthenticate: false
    })
  ),

  on(AuthActions.clearError, (state) => ({
      ...state,
      authError: null
    })
  ),

  on(AuthActions.clearAuthenticate, (state) => ({
      ...state,
      authError: null,
      auth: null,
      loading: false,
      isAuthenticate: false
    })
  ),
)
