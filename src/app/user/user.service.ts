import {Injectable} from "@angular/core";
import * as AppConstant from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {User} from "../share/model/user/user.model";
import {AlertService} from "../share/services/alert.service";
import {CREATE_USER_SUCCESSFULLY} from "../share/constrant/alert.constrant";
import {Router} from "@angular/router";
import {ResponseInfo} from "../share/model/common/ResponseInfo.model";
import {GetUsersRequest} from "../share/model/user/GetUsersRequest.model";
import {isNullOrUndefined} from "../share/Utils";
import {RequestInfo} from "../share/model/common/RequestInfo.model";

@Injectable({providedIn: 'root'})
export class UserService {
  public userUrl = AppConstant.SERVER_API_URL + 'api/user/';
  public users: User[] = [];

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
  ) {
  }

  handleError(resData) {
    const responseInfo: ResponseInfo = resData.error.responseInfo;
    this.alertService.showErrors(responseInfo);
  };

  handleGetUsers(resData) {
    console.log(resData)
  }

  handleCreateUser(resData) {
    console.log(resData)
    if (resData.id) {
      this.alertService.success(CREATE_USER_SUCCESSFULLY);
      this.router.navigate(["/user"]).then();
    }
  }

  createUser(newUser: User) {
    this.http.post(this.userUrl + 'create', newUser).subscribe({
      next: this.handleCreateUser.bind(this),
      error: this.handleError.bind(this)
    })
  }

  getUsers(request?: GetUsersRequest) {
    if (isNullOrUndefined(request)) {
      let requestInfo: RequestInfo = new RequestInfo(AppConstant.DEFAULT_PAGE, AppConstant.DEFAULT_SIZE, []);
      request = new GetUsersRequest("", requestInfo);
    }
    this.http.post(this.userUrl + 'list', request).subscribe({
      next: this.handleGetUsers.bind(this),
      error: this.handleError.bind(this)
    });
  }
}
