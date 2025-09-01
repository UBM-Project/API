import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsOptional()
    @IsString()
    company_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    problem_description?: string;

    @IsOptional()
    @IsString()
    proposed_solution?: string;

    @IsOptional()
    @IsString()
    functional_requirements?: string;

    @IsOptional()
    @IsString()
    expected_outputs?: string;

    @IsOptional()
    @IsString()
    attachment_path?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    company_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    problem_description?: string;

    @IsOptional()
    @IsString()
    proposed_solution?: string;

    @IsOptional()
    @IsString()
    functional_requirements?: string;

    @IsOptional()
    @IsString()
    expected_outputs?: string;

    @IsOptional()
    @IsString()
    attachment_path?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class ProjectResponseDto {
    project_id: number;
    company_id?: string;
    name?: string;
    category?: string;
    tags?: string;
    problem_description?: string;
    proposed_solution?: string;
    functional_requirements?: string;
    expected_outputs?: string;
    attachment_path?: string;
    status?: string;
    created_at: Date;
    updated_at: Date;
}
