// src/adapters/postgres.adapter.ts
import postgres, { Sql } from "postgres";
import dotenv from "dotenv";
import { DatabasePort } from "./IClient";

dotenv.config();

export class PostgresAdapter implements DatabasePort {
    private sql: Sql<any>;

    constructor(private connectionString: string = process.env.DATABASE_URL!) {
        this.sql = postgres(this.connectionString, {
            ssl: process.env.NODE_ENV === "production" ? "require" : false,
        });
    }

    async connect(): Promise<void> {
        await this.sql`SELECT 1`;
        console.log("Postgres conectado com sucesso!");
    }

    async disconnect(): Promise<void> {
        await this.sql.end();
        console.log("Postgres desconectado!");
    }

    async query<T extends any[] = any>(sql: string, params?: any[]): Promise<T[]> {
        if (params && params.length) {
            return await this.sql.unsafe<T>(sql, params);
        }
        return await this.sql.unsafe<T>(sql);
    }

    async transaction<T>(fn: (db: DatabasePort) => Promise<T>): Promise<T> {
        return await this.sql.begin<T>(async (tx) => {
            const adapter: DatabasePort = {
                query: async <U extends any[] = any>(sql: string, params?: any[]): Promise<U[]> => {
                    if (params && params.length) {
                        return await tx.unsafe<U>(sql, params);
                    }
                    return await tx.unsafe<U>(sql);
                },
                connect: async () => { },
                disconnect: async () => { },
                transaction: async (f: any) => f(adapter),
            };
            return await fn(adapter);
        }) as T;
    }
}
