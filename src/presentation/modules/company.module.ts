// src/presentation/user/user.module.ts
import { Module } from "@nestjs/common";
import { PostgresAdapter } from "src/infrastructure/db/client";
import { CompanyController } from "../controllers/company/company.controller";
import { CompanyRepository } from "src/repositories/company.repository";
import { CompanyService } from "src/application/company.service";

@Module({
    controllers: [CompanyController],
    providers: [
        PostgresAdapter, // client do Postgres
        {
            provide: 'CompanyRepositoryPort', // token para a interface
            useClass: CompanyRepository,      // implementação concreta
        },
        {
            provide: 'CompanyServicePort',    // token para o service
            useClass: CompanyService,
        },
    ],
    exports: ['CompanyRepositoryPort', 'CompanyServicePort'],
})
export class CompanyModule { }

