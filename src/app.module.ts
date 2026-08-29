import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FormationsModule } from './formations/formations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ContactModule } from './contact/contact.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { GalleryModule } from './gallery/gallery.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { isProduction } from './common/auth-cookie';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 120 }],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');
        if (isProduction() && !uri) {
          throw new Error('MONGODB_URI is required in production.');
        }
        return {
          uri: uri ?? 'mongodb://127.0.0.1:27017/trajecta',
        };
      },
    }),
    UsersModule,
    FormationsModule,
    ReviewsModule,
    ContactModule,
    VehiclesModule,
    SiteSettingsModule,
    GalleryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
