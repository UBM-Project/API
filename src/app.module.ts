import { Module } from '@nestjs/common';
import { AppController } from './presentation/app.controller';
import { AppService } from 'src/application/app.service';
import { UserModule } from './presentation/modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
