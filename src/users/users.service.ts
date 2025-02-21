import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByName(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username: username })
      .exec();
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async sendStudentId(username: string, body: any): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate(
        { username: username },
        { $addToSet: { studentIds: body.studentId } },
        { new: true },
      )
      .exec();
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }
}
