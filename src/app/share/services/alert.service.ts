import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ResponseInfo} from "../model/common/response-info.model";
import {Alert} from "../constant/alert.constant";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  duration = 5000;
  constructor(private _snackBar: MatSnackBar) {
  }

  handleErrors(resData) {
    if (!resData.error || !resData.error.responseInfo) {
      this.showError(Alert.DEFAULT_ERROR);
    }
    const responseInfo: ResponseInfo = resData.error.responseInfo;
    responseInfo.errors.forEach(error => {
      this.showError(error.message);
    });
  };

  success(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: this.duration,
      panelClass: ['app-notification-success']
    });
  }

  showError(message: string) {
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
