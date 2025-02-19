/**
 * Iam Access Token
 */
export class AccessTokenDto {
  /** the token to access resources. it would be sent as an http header to authorize the user */
  access_token = '';
  expires_in = 0;
  groups = [];
  id_token = '';
  jti = '';
  /** this would be used to refresh our desired token. Before accessToken expiry time, the token should be reset by this */
  refresh_token = '';
  scope = '';
  token_type = '';
  accessToken = '';
  refreshToken = '';
}
