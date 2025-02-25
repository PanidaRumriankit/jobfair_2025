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
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
        throw new NotFoundException(`User ${username} not found`);
    }

    const existingStudentId = user.studentIds.find(student => student.id === body.studentId);
    if (existingStudentId) {
        console.log(`Student ID ${body.studentId} already exists for user ${username}.`);
        return user;
    }

    user.studentIds.push({ id: body.studentId, timestamp: new Date() });
    await user.save();

    await this.sendDataToGoogleSheets(user);
    return user;
  }

  private async sendDataToGoogleSheets(user: User) {
    const url = "https://script.google.com/macros/s/AKfycbw3RJe0E1WKMDhdEi_L8t23bbSjUPpk25E2bknsrSdyCFTvcf6PnQvVLBzrMhz3CYV6/exec";
  
    const data = {
      Time: new Date().toISOString(),
      Username: user.username,
      Name: user.company,
      SSID: user.studentIds[user.studentIds.length - 1].id,
    };
  
    if (!url) {
      throw new Error("GOOGLE_SHEETS_API_URL is not defined");
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) {
        console.error("Failed to send data to Google Sheets:", response.status, response.statusText);
      } else {
        console.log("Data sent to Google Sheets successfully.");
      }
    } catch (error) {
      console.error("Error sending data to Google Sheets:", error);
    }
  }
}
