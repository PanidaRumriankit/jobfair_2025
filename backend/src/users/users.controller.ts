import { Controller, Get, Post, UseGuards, Request, } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const user = this.usersService.findByName(req.user.username);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  postStudentId(@Request() req) {
    return this.usersService.sendStudentId(req.user.username, req.body);
  }
}
