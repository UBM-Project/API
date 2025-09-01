import { CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto } from "src/presentation/controllers/company/company.dto";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "src/presentation/controllers/user/user.dto";
import { IResponseHateoas } from "./IResponse";
import { CreateProjectDto, UpdateProjectDto } from "src/presentation/controllers/project/project.dto";

export interface UserRepositoryPort {
    create(dto: CreateUserDto): Promise<IResponseHateoas<any>>;
    findById(id: string): Promise<IResponseHateoas<any>>;
    findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]>;
    findLogin(filters: Record<string, any>): Promise<IResponseHateoas<any>[]>
    update(id: string, dto: UpdateUserDto): Promise<IResponseHateoas<any>>;
    softDelete(id: string): Promise<any>;
}

export interface CompanyRepositoryPort {
  create(dto: CreateCompanyDto): Promise<IResponseHateoas<any>>;
  findById(id: string): Promise<IResponseHateoas<any>>;
  findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]>;
  update(id: string, dto: UpdateCompanyDto): Promise<IResponseHateoas<any>>;
  softDelete(id: string): Promise<IResponseHateoas<any>>;
}

export interface ProjectRepositoryPort {
  create(dto: CreateProjectDto): Promise<IResponseHateoas<any>>;
  findById(id: string): Promise<IResponseHateoas<any>>;
  findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]>;
  update(id: string, dto: UpdateProjectDto): Promise<IResponseHateoas<any>>;
  softDelete(id: string): Promise<IResponseHateoas<any>>;
}

export interface ProposalRepositoryPort {
  create(dto: CreateProjectDto): Promise<IResponseHateoas<any>>;
  findById(id: string): Promise<IResponseHateoas<any>>;
  findAll(filters: Record<string, any>): Promise<IResponseHateoas<any>[]>;
  update(id: string, dto: UpdateProjectDto): Promise<IResponseHateoas<any>>;
  softDelete(id: string): Promise<IResponseHateoas<any>>;
}