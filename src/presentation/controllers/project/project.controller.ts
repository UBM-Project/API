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
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import * as IRepository from 'src/domain/interfaces/IRepository';
import { JwtAuthGuard } from '../../auth/auth.guard';
import * as IService from 'src/domain/interfaces/IService';

@Controller('project')
export class ProjectController {
    constructor(
        @Inject('ProjectRepositoryPort')
        private readonly projectRepository: IRepository.ProjectRepositoryPort,

        @Inject('ProjectServicePort')
        private readonly projectService: IService.ProjectServicePort,
    ) { }

    @Post()
    async create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateProjectDto) {
        // Aqui poderia ter validações mínimas, mas CRUD vai direto pro repository
        return this.projectRepository.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.projectRepository.findById(id);
    }

    /**
  * GET /project
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

        return this.projectRepository.findAll(filters);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true })) dto: UpdateProjectDto) {
        return this.projectRepository.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
        return this.projectRepository.softDelete(id);
    }
}
