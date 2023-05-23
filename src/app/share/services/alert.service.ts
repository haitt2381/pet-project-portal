import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ResponseInfo} from "../model/common/ResponseInfo.model";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  duration = 5000;
  constructor(private _snackBar: MatSnackBar) {
  }

  showErrors(responseInfo: ResponseInfo) {
    responseInfo.errors.forEach(error => {
      this.error(error.message);
    });
  }

  success(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: this.duration,
      panelClass: ['app-notification-success']
    });
  }

  error(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: this.duration,
      panelClass: ['app-notification-error']
    });
  }

  info(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: this.duration,
      panelClass: ['app-notification-info']
    });
  }

  warn(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: this.duration,
      panelClass: ['app-notification-warn']
    });
  }
}
