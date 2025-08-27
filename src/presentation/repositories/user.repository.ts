import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from 'src/presentation/user/user.dto';
import { UserRepositoryPort } from '../../domain/interfaces/user/IUser.repository';
import { PostgresAdapter } from 'src/infrastructure/db/client';
import { tablesClient } from 'src/infrastructure/db/tables.client';

@Injectable()
export class UserRepository implements UserRepositoryPort {
    constructor(private readonly db: PostgresAdapter) { }

    private allowedFilterFields = ['name', 'email', 'user_type', 'is_active', 'company_id'];

    private toResponseDto(user: any): UserResponseDto {
        const { password_hash, ...rest } = user;
        return rest as UserResponseDto;
    }

    private toResponseDtoLogin(user: any): UserResponseDto {
        const { password_hash, ...rest } = user;
        return { password_hash:  password_hash} as UserResponseDto;
    }

    async create(dto: CreateUserDto): Promise<UserResponseDto> {
        const result = await this.db.query(
            `INSERT INTO ${tablesClient.users} (name, email, password_hash, user_type, is_active, company_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [dto.name, dto.email, dto.password_hash, dto.user_type || null, dto.is_active ?? true, dto.company_id || null]
        );

        return this.toResponseDto(result[0]);
    }

    async findById(id: string): Promise<UserResponseDto> {
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        if (!result[0]) throw new NotFoundException(`User ${id} not found`);
        return this.toResponseDto(result[0]);
    }

    async findAll(filters: Record<string, any>): Promise<UserResponseDto[]> {
        const conditions: string[] = [];
        const params: any[] = [];

        Object.entries(filters).forEach(([key, value], index) => {
            if (!this.allowedFilterFields.includes(key)) return;
            if (value !== undefined) {
                conditions.push(`${key} = $${params.length + 1}`);
                params.push(value);
            }
        });

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} ${whereClause}`, params);
        return result.map(this.toResponseDto);
    }

    async findLogin(filters: Record<string, any>): Promise<UserResponseDto[]> {
        const conditions: string[] = [];
        const params: any[] = [];

        Object.entries(filters).forEach(([key, value], index) => {
            if (!this.allowedFilterFields.includes(key)) return;
            if (value !== undefined) {
                conditions.push(`${key} = $${params.length + 1}`);
                params.push(value);
            }
        });

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await this.db.query(`SELECT * FROM ${tablesClient.users} ${whereClause}`, params);
        return result.map(this.toResponseDtoLogin);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
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
        return this.toResponseDto(updated[0]);
    }

    async softDelete(id: string): Promise<UserResponseDto> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`User ${id} not found`);

        await this.db.query(`UPDATE ${tablesClient.users} SET is_active = false WHERE user_id = $1`, [id]);
        const updated = await this.db.query(`SELECT * FROM ${tablesClient.users} WHERE user_id = $1`, [id]);
        return this.toResponseDto(updated[0]);
    }
}
