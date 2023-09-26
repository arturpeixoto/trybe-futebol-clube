// Código retirado do conteúdo da Trybe

import { JwtPayload, Secret, sign, SignOptions, verify } from 'jsonwebtoken';
import { IVerifyToken } from '../Interfaces/IVerifyToken';

export default class JWT {
  private static secret: Secret = process.env.JWT_SECRET || '';

  private static jwtConfig: SignOptions = {
    algorithm: 'HS256',
  };

  static sign(payload: JwtPayload): string {
    return sign({ ...payload }, this.secret, this.jwtConfig);
  }

  static verify(token: string): JwtPayload | string | IVerifyToken {
    try {
      return verify(token, this.secret);
    } catch (error) {
      return 'Token must be a valid token';
    }
  }
}
