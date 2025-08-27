import { IsString, IsOptional, IsBoolean, IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserType } from 'src/domain/value-objects/roles.user';

// DTO para criar usuário
export class CreateUserDto {
    @IsOptional() // pode ser gerado pelo banco
    @IsString()
    user_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password_hash?: string;

    @IsOptional()
    @IsEnum(UserType)
    user_type?: UserType;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean = false;

    @IsOptional()
    @IsString()
    company_id?: string;
}

// DTO para atualizar usuário
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password_hash?: string;

    @IsOptional()
    @IsEnum(UserType)
    user_type?: UserType;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsString()
    company_id?: string;
}

export class UserResponseDto {
    user_id: string;
    name?: string;
    email?: string;
    password_hash?: string;
    user_type?: UserType;
    is_active: boolean;
    company_id?: string;
    created_at: Date;
    updated_at: Date;
}

export class UserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password_hash: string;
}

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password_hash: string;
}

export { UserType };
