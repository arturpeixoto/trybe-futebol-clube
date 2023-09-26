export type IRole = {
  role: string;
};

export type IVerifyTokenSucess = {
  iat: string;
  email: string;
  role: string;
};

export type IVerifyToken = IVerifyTokenSucess | string | IRole;
