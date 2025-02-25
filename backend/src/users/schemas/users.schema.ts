import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {

  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  company: string;

  @Prop({
    type: [{ id: String, timestamp: Date }],
    default: []
  })
  studentIds: { id: string; timestamp: Date }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
