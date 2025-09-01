import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Inject,
    Put,
    ValidationPipe,
    UseGuards
} from '@nestjs/common';
import { CreateProposalDto, UpdateProposalDto } from './proposal.dto';
import * as IRepository from 'src/domain/interfaces/IRepository';
import { JwtAuthGuard } from '../../auth/auth.guard';
import * as IService from 'src/domain/interfaces/IService';

@Controller('proposal')
export class ProposalController {
    constructor(
        @Inject('ProposalRepositoryPort')
        private readonly proposalRepository: IRepository.ProposalRepositoryPort,

        @Inject('ProposalServicePort')
        private readonly proposalService: IService.ProposalServicePort,
    ) { }

    @Post()
    async create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateProposalDto) {
        // Aqui poderia ter validações mínimas, mas CRUD vai direto pro repository
        return this.proposalRepository.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.proposalRepository.findById(id);
    }

    /**
  * GET /proposal
  * Permite filtrar por:
  * - company_id (string)
  * - tag (pode ser múltiplas tags separadas por vírgula)
  * - name (busca por like, case-insensitive)
  * - category (string exata)
  * - status (string exata)
  */
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('company_id') companyId?: string,
        @Query('tags') tags?: string, // exemplo: tecnologia,diversidade
        @Query('name') name?: string,
        @Query('category') category?: string,
        @Query('status') status?: string,
    ) {
        const filters = {
            ...(companyId && { company_id: companyId }),
            ...(tags && { tags: tags.split(',').map((t) => t.trim()) }),
            ...(name && { name }),
            ...(category && { category }),
            ...(status && { status }),
        };

        return this.proposalRepository.findAll(filters);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true })) dto: UpdateProposalDto) {
        return this.proposalRepository.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
        return this.proposalRepository.softDelete(id);
    }
}
