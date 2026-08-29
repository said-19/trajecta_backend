import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

export enum ContactStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
}

@Schema({ timestamps: true, collection: 'contact_messages' })
export class ContactMessage {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ enum: ContactStatus, default: ContactStatus.NEW })
  status: ContactStatus;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
