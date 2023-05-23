import {createReducer, on} from "@ngrx/store";
import {User} from "../user.model";
import * as AuthActions from './auth.action';
import {ResponseInfo} from "../../share/model/common/ResponseInfo.model";


export interface State {
  auth: User | null
  responseInfo: ResponseInfo | null
  loading: boolean,
  isAuthenticate: boolean
}

// @ts-ignore
const initialSate: State = {
  auth: null,
  responseInfo: null,
  loading: false,
  isAuthenticate: false,
}

export const authReducer = createReducer(
  initialSate,

  on(AuthActions.loginStart, AuthActions.signupStart, (state) => (
    {
      ...state,
      responseInfo: null,
      loading: true
    }
  )),

  on(AuthActions.authenticateSuccess, (state, payload) => (
    {
      ...state,
      responseInfo: null,
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

  on(AuthActions.authenticateFail, (state, {responseInfo}) => {
      return {
        ...state,
        auth: null,
        responseInfo: responseInfo,
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
      responseInfo: null
    })
  ),

  on(AuthActions.clearAuthenticate, (state) => ({
      ...state,
      responseInfo: null,
      auth: null,
      loading: false,
      isAuthenticate: false
    })
  ),
)
