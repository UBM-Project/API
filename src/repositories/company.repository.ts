import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CompanyRepositoryPort } from 'src/domain/interfaces/IRepository';
import { PostgresAdapter } from 'src/infrastructure/db/client';
import { tablesClient } from 'src/infrastructure/db/tables.client';
import { CreateCompanyDto, UpdateCompanyDto } from 'src/presentation/controllers/company/company.dto';
import { IResponseHateoas } from 'src/domain/interfaces/IResponse';

@Injectable()
export class CompanyRepository implements CompanyRepositoryPort {
    constructor(private readonly db: PostgresAdapter) { }

    private allowedFilterFields = ['name', 'email', 'is_active', 'is_external', 'location', 'business_area'];

    // === CENTRALIZA O HATEOAS ===
    private buildHateoas(company: any): IResponseHateoas<any> {
        const id = company.company_id || company[0]?.company_id;
        return {
            data: Array.isArray(company) ? company[0] : company,
            _links: {
                self: `/company/${id}`,
                get: `/company/${id}`,
                put: `/company/${id}`,
                delete: `/company/${id}`,
            }
        };
    }

    async create(dto: CreateCompanyDto): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `INSERT INTO ${tablesClient.company} 
             (name, email, is_active, is_external, location, business_area) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                dto.name,
                dto.email,
                dto.is_active ?? true,
                dto.is_external ?? false,
                dto.location || null,
                dto.business_area || null,
            ]
        );

        return this.buildHateoas(result[0]);
    }

    async findById(id: string): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `SELECT * FROM ${tablesClient.company} WHERE company_id = $1`,
            [id]
        );

        if (!result[0]) throw new NotFoundException(`Company ${id} not found`);
        return this.buildHateoas(result[0]);
    }

    async findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]> {
        const { whereClause, params } = this.buildFilterQuery(filters);
        const result = await this.db.query(`SELECT * FROM ${tablesClient.company} ${whereClause}`, params);
        return result.map(company => this.buildHateoas(company));
    }

    async update(id: string, dto: UpdateCompanyDto): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.company} WHERE company_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`Company ${id} not found`);
        if (dto.email && !dto.email.includes('@')) {
            throw new BadRequestException('Email inválido');
        }

        const fields = Object.keys(dto);
        if (fields.length > 0) {
            const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
            const values = Object.values(dto);
            await this.db.query(
                `UPDATE ${tablesClient.company} SET ${setClauses}, updated_at = NOW() WHERE company_id = $${fields.length + 1}`,
                [...values, id]
            );
        }

        const updated = await this.db.query(`SELECT * FROM ${tablesClient.company} WHERE company_id = $1`, [id]);
        return this.buildHateoas(updated[0]);
    }

    async softDelete(id: string): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.company} WHERE company_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`Company ${id} not found`);

        await this.db.query(
            `UPDATE ${tablesClient.company} SET is_active = false, updated_at = NOW() WHERE company_id = $1`,
            [id]
        );

        const updated = await this.db.query(`SELECT * FROM ${tablesClient.company} WHERE company_id = $1`, [id]);
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
