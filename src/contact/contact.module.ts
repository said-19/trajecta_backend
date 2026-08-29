import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ContactMessage,
  ContactMessageSchema,
} from './schemas/contact-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ContactModule {}
