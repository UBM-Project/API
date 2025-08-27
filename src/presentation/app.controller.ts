import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/application/app.service';
import { PostgresAdapter } from 'src/infrastructure/db/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getHello(): Promise<string> {
    const db = new PostgresAdapter();

    await db.connect();

    await db.disconnect();
    
    return this.appService.getHello();
  }
}
