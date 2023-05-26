import {Injectable} from '@angular/core';
import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {exhaustMap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {UserLogin} from "../share/model/auth/user-login.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userLogged.pipe(
      take(1),
      exhaustMap((auth: UserLogin) => {
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
