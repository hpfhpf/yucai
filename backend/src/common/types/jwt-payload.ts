export interface JwtPayload {
  sub: string;       // user id
  phone: string;
  role: string;
  idVerified: boolean;
}
