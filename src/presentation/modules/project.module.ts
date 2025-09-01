// src/presentation/project/project.module.ts
import { Module } from "@nestjs/common";
import { ProjectRepository } from "../../repositories/project.repository";
import { PostgresAdapter } from "../../infrastructure/db/client";
import { ProjectController } from "../controllers/project/project.controller";
import { ProjectService } from "../../application/project.service";

@Module({
    controllers: [ProjectController],
    providers: [
        PostgresAdapter, // client do Postgres
        {
            provide: 'ProjectRepositoryPort', // token para a interface
            useClass: ProjectRepository,      // implementação concreta
        },
        {
            provide: 'ProjectServicePort',    // token para o service
            useClass: ProjectService,
        },
    ],
    exports: ['ProjectRepositoryPort', 'ProjectServicePort'],
})
export class ProjectModule { }

