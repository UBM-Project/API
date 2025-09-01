import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/presentation/controllers/user/user.dto';
import { UserRepositoryPort } from '../domain/interfaces/IRepository';
import { PostgresAdapter } from 'src/infrastructure/db/client';
import { tablesClient } from 'src/infrastructure/db/tables.client';
import { IResponseHateoas } from 'src/domain/interfaces/IResponse';

@Injectable()
export class UserRepository implements UserRepositoryPort {
    constructor(private readonly db: PostgresAdapter) { }

    private allowedFilterFields = ['name', 'email', 'user_type', 'is_active', 'company_id'];

    // === CENTRALIZA O HATEOAS ===
    private buildHateoas(resource: any): IResponseHateoas<any> {
        const { password_hash, ...rest } = resource;
        const id = rest.user_id || rest[0]?.user_id; // suporte array de retorno
        return {
            data: Array.isArray(rest) ? rest[0] : rest,
            _links: {
                self: `/users/${id}`,
                get: `/users/${id}`,
                put: `/users/${id}`,
                delete: `/users/${id}`,
            }
        };
    }

    private buildLoginResponse(resource: any) {
        const { password_hash } = resource;
        return { password_hash };
    }

    // === CRUD ===

    async create(dto: CreateUserDto): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `INSERT INTO ${tablesClient.users} (name, email, password_hash, user_type, is_active, company_id) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [dto.name, dto.email, dto.password_hash, dto.user_type || null, dto.is_active ?? true, dto.company_id || null]
        );

        return this.buildHateoas(result[0]);
    }

    async findById(id: string): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        if (!result[0]) throw new NotFoundException(`User ${id} not found`);
        return this.buildHateoas(result[0]);
    }

    async findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]> {
        const { whereClause, params } = this.buildFilterQuery(filters);
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} ${whereClause}`, params);
        return result.map(user => this.buildHateoas(user));
    }

    async findLogin(filters: Record<string, any>): Promise<any[]> {
        const { whereClause, params } = this.buildFilterQuery(filters);
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} ${whereClause}`, params);
        return result.map(user => this.buildLoginResponse(user));
    }

    async update(id: string, dto: UpdateUserDto): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`User ${id} not found`);

        if (dto.email && !dto.email.includes('@')) {
            throw new BadRequestException('Email inválido');
        }

        const fields = Object.keys(dto);
        const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = Object.values(dto);

        await this.db.query(
            `UPDATE ${tablesClient.users} SET ${setClauses} WHERE user_id = $${fields.length + 1}`,
            [...values, id]
        );

        const updated = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        return this.buildHateoas(updated[0]);
    }

    async softDelete(id: string): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`User ${id} not found`);

        await this.db.query(`UPDATE ${tablesClient.users} SET is_active = false WHERE user_id = $1`, [id]);
        const updated = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        return this.buildHateoas(updated[0]);
    }

    // === AUX ===
    private buildFilterQuery(filters: Record<string, any>) {
        const conditions: string[] = [];
        const params: any[] = [];

        Object.entries(filters).forEach(([key, value]) => {
            if (!this.allowedFilterFields.includes(key)) return;
            if (value !== undefined) {
                conditions.push(`${key} = $${params.length + 1}`);
                params.push(value);
            }
        });

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        return { whereClause, params };
    }
}
