import {Action, createAction, props} from "@ngrx/store";
import {Auth, Login} from "../user.model";
import {ResponseInfo} from "../../share/model/common/ResponseInfo.model";

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const CLEAR_AUTHENTICATE = '[Auth] Clear Authenticate';
export const REFRESH_TOKEN = '[Auth] Refresh token';


export const loginStart = createAction(LOGIN_START, props<Login>())

export const authenticateSuccess = createAction(AUTHENTICATE_SUCCESS, props<Auth>())

export const authenticateFail = createAction(AUTHENTICATE_FAIL, props<{authError}>())

export const autoLogin = createAction(AUTO_LOGIN)

export const logout = createAction(LOGOUT)

export const signupStart = createAction(SIGNUP_START, props<Login>)

export const clearError = createAction(CLEAR_ERROR)

export const clearAuthenticate = createAction(CLEAR_AUTHENTICATE)

export const refreshToken = createAction(REFRESH_TOKEN, props<{refreshToken: string}>())
