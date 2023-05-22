import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import {take, exhaustMap, map} from 'rxjs/operators';

import { AuthService } from './auth.service';
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.auth
      }),
      exhaustMap(auth => {
        if (!auth) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', auth.token || '')
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
