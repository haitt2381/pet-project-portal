import {Injectable} from '@angular/core';
import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {exhaustMap, map, take} from 'rxjs/operators';

import {AuthService} from './auth.service';
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
        if (!auth || !auth.token) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + auth.token || '')
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
