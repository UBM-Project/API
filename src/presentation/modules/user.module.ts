// src/presentation/user/user.module.ts
import { Module } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { PostgresAdapter } from "src/infrastructure/db/client";
import { UserController } from "../user/user.controller";
import { UserService } from "src/application/user/user.service";

@Module({
    controllers: [UserController],
    providers: [
        PostgresAdapter, // client do Postgres
        {
            provide: 'UserRepositoryPort', // token para a interface
            useClass: UserRepository,      // implementação concreta
        },
        {
            provide: 'UserServicePort',    // token para o service
            useClass: UserService,
        },
    ],
    exports: ['UserRepositoryPort', 'UserServicePort'],
})
export class UserModule { }

