import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail } from 'class-validator';

export class CreateProposalDto {
    @IsOptional()
    @IsNumber()
    project_id?: number;

    @IsOptional()
    @IsString()
    company_id?: string;

    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsEmail()
    user_email?: string;

    @IsOptional()
    @IsNumber()
    participants?: number;

    @IsOptional()
    @IsString()
    solving_company_id?: string;

    @IsOptional()
    @IsString()
    submitting_company_id?: string;

    @IsOptional()
    @IsString()
    attachment_path?: string;

    @IsOptional()
    @IsNumber()
    market_value?: number;

    @IsOptional()
    @IsNumber()
    proposal_value?: number;

    @IsOptional()
    @IsBoolean()
    is_volunteer?: boolean;

    @IsOptional()
    @IsString()
    status?: string;
}

export class UpdateProposalDto {
    @IsOptional()
    @IsNumber()
    project_id?: number;

    @IsOptional()
    @IsString()
    company_id?: string;

    @IsOptional()
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsEmail()
    user_email?: string;

    @IsOptional()
    @IsNumber()
    participants?: number;

    @IsOptional()
    @IsString()
    solving_company_id?: string;

    @IsOptional()
    @IsString()
    submitting_company_id?: string;

    @IsOptional()
    @IsString()
    attachment_path?: string;

    @IsOptional()
    @IsNumber()
    market_value?: number;

    @IsOptional()
    @IsNumber()
    proposal_value?: number;

    @IsOptional()
    @IsBoolean()
    is_volunteer?: boolean;

    @IsOptional()
    @IsString()
    status?: string;
}

export class ProposalResponseDto {
    proposal_id: number;
    project_id?: number;
    company_id?: string;
    user_id?: string;
    user_email?: string;
    participants?: number;
    solving_company_id?: string;
    submitting_company_id?: string;
    attachment_path?: string;
    market_value?: number;
    proposal_value?: number;
    is_volunteer?: boolean;
    status?: string;
    created_at: Date;
    updated_at: Date;
}
