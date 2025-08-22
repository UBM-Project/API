import { Module } from '@nestjs/common';
import { AppController } from './presentation/user/app.controller';
import { AppService } from './domain/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
