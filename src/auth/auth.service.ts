import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string): Promise<any> {
    console.log('validateUser', name, pass);
    const user = await this.usersService.findByName(name);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      console.log('Password match:', result);
      return result;
    }
    console.log('User not found or password mismatch');
    return null;
  }

  async login(user: any) {
    const payload = { username: user._doc.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}