// src/presentation/proposal/proposal.module.ts
import { Module } from "@nestjs/common";
import { ProposalRepository } from "../../repositories/proposal.repository";
import { PostgresAdapter } from "../../infrastructure/db/client";
import { ProposalController } from "../controllers/proposal/proposal.controller";
import { ProposalService } from "../../application/proposal.service";

@Module({
    controllers: [ProposalController],
    providers: [
        PostgresAdapter, // client do Postgres
        {
            provide: 'ProposalRepositoryPort', // token para a interface
            useClass: ProposalRepository,      // implementação concreta
        },
        {
            provide: 'ProposalServicePort',    // token para o service
            useClass: ProposalService,
        },
    ],
    exports: ['ProposalRepositoryPort', 'ProposalServicePort'],
})
export class ProposalModule { }

