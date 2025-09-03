import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProposalRepositoryPort } from 'src/domain/interfaces/IRepository';
import { PostgresAdapter } from 'src/infrastructure/db/client';
import { tablesClient } from 'src/infrastructure/db/tables.client';
import { CreateProposalDto, UpdateProposalDto } from 'src/presentation/controllers/proposal/proposal.dto';
import { IResponseHateoas } from 'src/domain/interfaces/IResponse';

@Injectable()
export class ProposalRepository implements ProposalRepositoryPort {
    constructor(private readonly db: PostgresAdapter) { }

    private allowedFilterFields = ['name', 'email', 'is_active', 'is_external', 'location', 'business_area'];

    // === CENTRALIZA O HATEOAS ===
    private buildHateoas(proposal: any): IResponseHateoas<any> {
        const id = proposal.proposal_id || proposal[0]?.proposal_id;
        return {
            data: Array.isArray(proposal) ? proposal[0] : proposal,
            _links: {
                self: `/proposal/${id}`,
                get: `/proposal/${id}`,
                put: `/proposal/${id}`,
                delete: `/proposal/${id}`,
            }
        };
    }

    async create(dto: CreateProposalDto): Promise<IResponseHateoas<any>> {
        // 1. Cria a proposal principal
        const result = await this.db.query(
            `INSERT INTO ${tablesClient.proposal} 
      (project_id, company_id, user_id, user_email, participants, solving_company_id, submitting_company_id, attachment_path, market_value, proposal_value, is_volunteer, status) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
     RETURNING *`,
            [
                dto.project_id || null,
                dto.company_id || null,
                dto.user_id || null,
                dto.user_email || null,
                dto.participants || null,
                dto.solving_company_id || null,
                dto.submitting_company_id || null,
                dto.attachment_path || null,
                dto.market_value || null,
                dto.proposal_value ?? 0,
                dto.is_volunteer ?? false,
                dto.status || 'submitted',
            ],
        );

        const createdProposal = result[0];

        // 2. Cria o vínculo em proposal_user (1x1, não lista)
        await this.db.query(
            `INSERT INTO ${tablesClient.proposal_user} 
        (proposal_id, user_id, proposal_name, user_email) 
        VALUES ($1, $2, $3, $4)`,
            [
                createdProposal.proposal_id,
                createdProposal.user_id,
                createdProposal.proposal_name || null,
                createdProposal.user_email || null,
            ],
        );

        return this.buildHateoas(createdProposal);
    }



    async findById(id: string): Promise<IResponseHateoas<any>> {
        const result = await this.db.query(
            `SELECT * FROM ${tablesClient.proposal} WHERE proposal_id = $1`,
            [id]
        );

        if (!result[0]) throw new NotFoundException(`Proposal ${id} not found`);
        return this.buildHateoas(result[0]);
    }

    async findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]> {
        const { whereClause, params } = this.buildFilterQueryFindAll(filters);

        const result = await this.db.query(
            `SELECT * FROM ${tablesClient.proposal} ${whereClause}`,
            params,
        );

        return result.map((proposal) => this.buildHateoas(proposal));
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


    async update(id: string, dto: UpdateProposalDto): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(
            `SELECT * FROM ${tablesClient.proposal} WHERE proposal_id = $1`,
            [id]
        );
        if (!existing[0]) throw new NotFoundException(`Proposal ${id} not found`);

        const fields = Object.keys(dto);
        if (fields.length > 0) {
            const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
            const values = Object.values(dto);

            const result = await this.db.query(
                `UPDATE ${tablesClient.proposal} 
       SET ${setClauses}, updated_at = NOW() 
       WHERE proposal_id = $${fields.length + 1} 
       RETURNING *`,
                [...values, id]
            );

            return this.buildHateoas(result[0]);
        }

        return this.buildHateoas(existing[0]); // se não tiver campo pra atualizar, retorna o original
    }


    async softDelete(id: string): Promise<IResponseHateoas<any>> {
        const existing = await this.db.query(`SELECT * FROM ${tablesClient.proposal} WHERE proposal_id = $1`, [id]);
        if (!existing[0]) throw new NotFoundException(`Proposal ${id} not found`);

        await this.db.query(
            `UPDATE ${tablesClient.proposal} SET is_active = false, updated_at = NOW() WHERE proposal_id = $1`,
            [id]
        );

        const updated = await this.db.query(`SELECT * FROM ${tablesClient.proposal} WHERE proposal_id = $1`, [id]);
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
