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
import { CreateCompanyDto, UpdateCompanyDto } from './company.dto';
import * as IRepository from 'src/domain/interfaces/IRepository';
import { JwtAuthGuard } from '../../auth/auth.guard';
import * as IService from 'src/domain/interfaces/IService';

@Controller('company')
export class CompanyController {
    constructor(
        @Inject('CompanyRepositoryPort')
        private readonly companyRepository: IRepository.CompanyRepositoryPort,

        @Inject('CompanyServicePort')
        private readonly companyService: IService.CompanyServicePort,
    ) { }

    @Post()
    async create(@Body(new ValidationPipe({ whitelist: true })) dto: CreateCompanyDto) {
        // Aqui poderia ter validações mínimas, mas CRUD vai direto pro repository
        return this.companyRepository.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.companyRepository.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Query() filters: Record<string, any>) {
        return this.companyRepository.findAll(filters);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body(new ValidationPipe({ whitelist: true })) dto: UpdateCompanyDto) {
        return this.companyRepository.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
        return this.companyRepository.softDelete(id);
    }
}
