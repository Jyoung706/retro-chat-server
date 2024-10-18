export interface TokenResponse {
  access_token: string;
  // refreshToken: string;
}

export interface TokenPayload {
  nickname: string;
  sub: string;
  iat: number;
}
