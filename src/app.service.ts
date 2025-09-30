import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const app='1234588888';
    return app;
  }
}
