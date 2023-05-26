export class UserLogin {
  preferred_username: string
  email: string
  private readonly _token: string | null;
  private readonly _tokenExpirationDate: Date;
  private readonly _refreshToken: string | null;
  private readonly _refreshTokenExpirationDate: Date


  constructor(preferred_username: string, email: string, token: string | null, tokenExpirationDate: Date, refreshToken: string | null, refreshTokenExpirationDate: Date) {
    this.preferred_username = preferred_username;
    this.email = email;
    this._token = token;
    this._tokenExpirationDate = tokenExpirationDate;
    this._refreshToken = refreshToken;
    this._refreshTokenExpirationDate = refreshTokenExpirationDate;
  }

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
