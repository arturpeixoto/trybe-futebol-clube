import * as bcrypt from 'bcryptjs';
import { IToken } from '../Interfaces/IToken';
import { ServiceMessage, ServiceResponse } from '../Interfaces/ServiceResponse';
import { IUser } from '../Interfaces/users/IUser';
import { IUserModel } from '../Interfaces/users/IUserModel';
import UserModel from '../models/UserModel';
import JWT from '../utils/JWT';
import { IRole, IVerifyTokenSucess } from '../Interfaces/IVerifyToken';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
  ) {}

  public async login(data: IUser): Promise<ServiceResponse<ServiceMessage | IToken>> {
    const user = await this.userModel.findByEmail(data.email);
    if (!user) return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    if (!bcrypt.compareSync(data.password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }
    const { email, role } = user as IUser;
    const token = this.jwtService.sign({ email, role });
    return { status: 'SUCCESSFUL', data: { token } };
  }

  public async getRole(token: string):
  Promise<ServiceResponse<ServiceMessage | string | IRole>> {
    const decoded = this.jwtService.verify(token) as IVerifyTokenSucess;
    const { role } = decoded;
    return { status: 'SUCCESSFUL', data: { role } };
  }
}
