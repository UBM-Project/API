import { Module } from '@nestjs/common';
import { AppController } from './presentation/app.controller';
import { AppService } from 'src/application/app.service';
import { UserModule } from './presentation/modules/user.module';
import { CompanyModule } from './presentation/modules/company.module';
import { ProjectModule } from './presentation/modules/project.module';
import { ProposalModule } from './presentation/modules/proposal.module';
@Module({
  imports: [UserModule, CompanyModule, ProjectModule, ProposalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
