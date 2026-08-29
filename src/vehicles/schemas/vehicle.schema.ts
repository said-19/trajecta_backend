import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ timestamps: true, collection: 'vehicles' })
export class Vehicle {
  @Prop({ required: true, trim: true })
  brand: string;

  @Prop({ required: true, trim: true })
  model: string;

  @Prop({ trim: true })
  plateNumber?: string;

  @Prop()
  year?: number;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
