export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

export interface TokenPayload {
  nickname: string;
  sub: string;
  iat: number;
}
