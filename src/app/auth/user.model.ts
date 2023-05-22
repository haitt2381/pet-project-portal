export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string | null,
    private _tokenExpirationDate: Date,
    private _refreshToken: string | null,
    private _refreshTokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get refreshToken() {
    if (!this._refreshTokenExpirationDate || new Date() > this._refreshTokenExpirationDate) {
      return null;
    }
    return this._refreshToken;
  }
}

export class Login {
  email: string;
  password: string
}

export class Auth {
  email: string;
  userId: string;
  token: string | null;
  expirationDate: Date;
  refreshToken: string | null;
  refreshExpirationDate: Date;
  redirect: boolean;
}
