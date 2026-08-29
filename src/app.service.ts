import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getLiveness() {
    return {
      status: 'ok',
      service: 'trajecta-api',
    };
  }

  getReadiness() {
    const connected = this.connection.readyState === 1;
    return {
      status: connected ? 'ok' : 'unavailable',
      service: 'trajecta-api',
      database: {
        connected,
      },
    };
  }
}
