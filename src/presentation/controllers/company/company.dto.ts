// src/presentation/company/company.dto.ts
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsBoolean()
    is_external?: boolean;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    business_area?: string;
}

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsBoolean()
    is_external?: boolean;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    business_area?: string;
}

export class CompanyResponseDto {
    company_id: string;
    name?: string;
    email?: string;
    is_active?: boolean;
    is_external?: boolean;
    location?: string;
    business_area?: string;
    created_at: Date;
    updated_at: Date;
}
