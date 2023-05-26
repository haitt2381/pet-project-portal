export interface AuthResponseData {
  email: string;
  userId: string;
  'access_token': string;
  'refresh_token': string;
  'expires_in': string;
  'refresh_expires_in': string;
  registered?: boolean;
}
