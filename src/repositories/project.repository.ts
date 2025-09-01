import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProjectRepositoryPort } from 'src/domain/interfaces/IRepository';
import { PostgresAdapter } from 'src/infrastructure/db/client';
import { tablesClient } from 'src/infrastructure/db/tables.client';
import { CreateProjectDto, UpdateProjectDto } from 'src/presentation/controllers/project/project.dto';
import { IResponseHateoas } from 'src/domain/interfaces/IResponse';

@Injectable()
export class ProjectRepository implements ProjectRepositoryPort {
    constructor(private readonly db: PostgresAdapter) { }

    private allowedFilterFields = ['name', 'email', 'is_active', 'is_external', 'location', 'business_area'];

    // === CENTRALIZA O HATEOAS ===
    private buildHateoas(project: any): IResponseHateoas<any> {
        const id = project.project_id || project[0]?.project_id;
        return {
            data: Array.isArray(project) ? project[0] : project,
            _links: {
                self: `/project/${id}`,
                get: `/project/${id}`,
                put: `/project/${id}`,
                delete: `/project/${id}`,
            }
        };
    }

    async create(dto: CreateProjectDto): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `INSERT INTO ${tablesClient.project} 
     (company_id, name, category, tags, problem_description, proposed_solution, functional_requirements, expected_outputs, attachment_path, status) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
     RETURNING *`,
            [
                dto.company_id || null,
                dto.name || null,
                dto.category || '1',
                dto.tags || null,
                dto.problem_description || null,
                dto.proposed_solution || null,
                dto.functional_requirements || '1',
                dto.expected_outputs || '1',
                dto.attachment_path || null,
                dto.status || 'pending',
            ]
        );

        return this.buildHateoas(result[0]);
    }

    async findById(id: string): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `SELECT * FROM ${tablesClient.project} WHERE project_id = $1`,
            [id]
        );

        if (!result[0]) throw new NotFoundException(`Project ${id} not found`);
        return this.buildHateoas(result[0]);
    }

    async findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]> {
        const { whereClause, params } = this.buildFilterQueryFindAll(filters);

        const result = await this.db.query(
            `SELECT * FROM ${tablesClient.project} ${whereClause}`,
            params,
        );

        return result.map((project) => this.buildHateoas(project));
    }

    /**
  * Monta cláusula WHERE e parâmetros dinamicamente
  * Aceita qualquer campo enviado em `filters`
  */
    private buildFilterQueryFindAll(filters: Record<string, any>): {
        whereClause: string;
        params: any[];
    } {
        const conditions: string[] = [];
        const params: any[] = [];

        Object.entries(filters).forEach(([field, value]) => {
            if (value === undefined || value === null) return;

            if (Array.isArray(value)) {
                // Exemplo: tags: ['tech', 'industry']
                const arrConds = value.map((v, i) => {
                    params.push(`%${v}%`);
                    return `${field} ILIKE $${params.length}`;
                });
                conditions.push(`(${arrConds.join(' OR ')})`);
            } else if (typeof value === 'string') {
                // Strings -> busca parcial case-insensitive
                params.push(`%${value}%`);
                conditions.push(`${field} ILIKE $${params.length}`);
            } else {
                // Números, booleanos, etc. -> igualdade direta
                params.push(value);
                conditions.push(`${field} = $${params.length}`);
            }
        });

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        return { whereClause, params };
    }

    async update(id: string, dto: UpdateProjectDto): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(
            `SELECT * FROM ${tablesClient.project} WHERE project_id = $1`,
            [id]
        );
        if (!existing[0]) throw new NotFoundException(`Project ${id} not found`);

        const fields = Object.keys(dto);
        if (fields.length > 0) {
            const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
            const values = Object.values(dto);

            const result = await this.db.query(
                `UPDATE ${tablesClient.project} 
       SET ${setClauses}, updated_at = NOW() 
       WHERE project_id = $${fields.length + 1} 
       RETURNING *`,
                [...values, id]
            );

            return this.buildHateoas(result[0]);
        }

        return this.buildHateoas(existing[0]); // se não tiver campo pra atualizar, retorna o original
    }


    async softDelete(id: string): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.project} WHERE project_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`Project ${id} not found`);

        await this.db.query(
            `UPDATE ${tablesClient.project} SET is_active = false, updated_at = NOW() WHERE project_id = $1`,
            [id]
        );

        const updated = await this.db.query(`SELECT * FROM ${tablesClient.project} WHERE project_id = $1`, [id]);
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
