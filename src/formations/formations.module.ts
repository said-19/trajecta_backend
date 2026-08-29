import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Formation, FormationSchema } from './schemas/formation.schema';
import { FormationsService } from './formations.service';
import { FormationsController } from './formations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Formation.name, schema: FormationSchema },
    ]),
  ],
  controllers: [FormationsController],
  providers: [FormationsService],
  exports: [FormationsService, MongooseModule],
})
export class FormationsModule {}
